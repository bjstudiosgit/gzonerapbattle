begin;
alter table public.museum_bids add column if not exists retracted_at timestamptz;
create or replace function public.get_museum_auctions()
returns table(item_id text, item_name text, status text, starting_pence integer, increment_pence integer,
  starts_at timestamptz, ends_at timestamptz, condition_note text, collection_note text, image_url text,
  current_pence integer, bid_count bigint, is_leading boolean, server_time timestamptz)
language sql security definer set search_path = '' as $$
  select a.item_id, a.item_name, a.status, a.starting_pence, a.increment_pence,
    a.starts_at, a.ends_at, a.condition_note, a.collection_note, a.image_url,
    top_bid.amount_pence, (select count(*) from public.museum_bids b where b.item_id = a.item_id and b.retracted_at is null),
    coalesce(top_bid.user_id = auth.uid(), false), clock_timestamp()
  from public.museum_auctions a
  left join lateral (select b.amount_pence, b.user_id from public.museum_bids b
    where b.item_id = a.item_id and b.retracted_at is null order by b.amount_pence desc limit 1) top_bid on true
  where a.status <> 'draft';
$$;

create or replace function public.place_museum_bid(auction_item text, bid_pence integer, request_id uuid)
returns public.museum_bids language plpgsql security definer set search_path = '' as $$
declare
  member_id uuid := auth.uid();
  auction public.museum_auctions;
  previous public.museum_bids;
  highest public.museum_bids;
  saved public.museum_bids;
  minimum integer;
begin
  if member_id is null then raise exception 'Sign in to place a bid.'; end if;
  if not exists(select 1 from public.backstage_profiles where user_id = member_id) then
    raise exception 'Choose your Gzone username in account settings before bidding.';
  end if;
  if request_id is null or bid_pence is null or bid_pence < 1 or bid_pence > 1000000 then
    raise exception 'Enter a bid between £0.01 and £10,000.';
  end if;
  -- One request at a time per member; row lock also serialises competing bidders.
  perform pg_advisory_xact_lock(hashtextextended(member_id::text, 610));
  select * into previous from public.museum_bids where id = request_id;
  if found then
    if previous.user_id = member_id and previous.item_id = auction_item and previous.amount_pence = bid_pence then return previous; end if;
    raise exception 'This bid request has already been used. Refresh and try again.';
  end if;
  select * into auction from public.museum_auctions where item_id = auction_item for update;
  if not found then raise exception 'This item is not open for bidding.'; end if;
  if auction.status <> 'open' or auction.starts_at > clock_timestamp()
    or (auction.ends_at is not null and auction.ends_at <= clock_timestamp()) then
    raise exception 'Bidding is not open on this item.';
  end if;
  select * into highest from public.museum_bids where item_id = auction_item and retracted_at is null order by amount_pence desc limit 1;
  if highest.user_id = member_id then raise exception 'You already hold the highest bid.'; end if;
  minimum := case when highest.id is null then auction.starting_pence else highest.amount_pence + auction.increment_pence end;
  if bid_pence <> minimum then raise exception 'Use the exact next bid shown. Bids go up by 20p; refresh and try again.'; end if;
  if exists(select 1 from public.museum_bids where user_id = member_id and created_at > clock_timestamp() - interval '2 seconds') then
    raise exception 'Please wait a moment before placing another bid.';
  end if;
  insert into public.museum_bids(id, item_id, user_id, amount_pence)
    values(request_id, auction_item, member_id, bid_pence) returning * into saved;
  return saved;
end;
$$;

create or replace function public.get_my_museum_bids()
returns table(id uuid, item_id text, item_name text, amount_pence integer, created_at timestamptz,
  current_pence integer, status text, ends_at timestamptz, is_highest boolean, is_my_lead boolean)
language sql security definer set search_path = '' as $$
  select b.id, b.item_id, a.item_name, b.amount_pence, b.created_at, coalesce(top_bid.amount_pence, a.starting_pence),
    case when b.retracted_at is not null then 'retracted' when a.status = 'open' and a.ends_at <= clock_timestamp() then 'closed' else a.status end,
    a.ends_at, coalesce(b.id = top_bid.id, false), coalesce(top_bid.user_id = auth.uid(), false)
  from public.museum_bids b join public.museum_auctions a on a.item_id = b.item_id
  left join lateral (select t.id, t.user_id, t.amount_pence from public.museum_bids t
    where t.item_id = b.item_id and t.retracted_at is null order by t.amount_pence desc limit 1) top_bid on true
  where b.user_id = auth.uid()
  order by b.created_at desc, b.id desc limit 100;
$$;
revoke all on function public.get_museum_auctions() from public, anon, authenticated;
revoke all on function public.place_museum_bid(text, integer, uuid) from public, anon, authenticated;
revoke all on function public.get_my_museum_bids() from public, anon, authenticated;
grant execute on function public.get_museum_auctions() to anon, authenticated;
grant execute on function public.place_museum_bid(text, integer, uuid) to authenticated;
grant execute on function public.get_my_museum_bids() to authenticated;
create or replace function public.retract_museum_bid(bid_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  member_id uuid := auth.uid();
  target public.museum_bids;
begin
  if member_id is null then raise exception 'Sign in to retract a bid.'; end if;
  perform pg_advisory_xact_lock(hashtextextended(member_id::text, 610));
  select * into target from public.museum_bids where id = bid_id and user_id = member_id;
  if not found then raise exception 'This bid is not available in your account.'; end if;
  perform 1 from public.museum_auctions where item_id = target.item_id for update;
  update public.museum_bids set retracted_at = clock_timestamp()
    where id = bid_id and user_id = member_id and retracted_at is null;
end;
$$;
revoke all on function public.retract_museum_bid(uuid) from public, anon, authenticated;
grant execute on function public.retract_museum_bid(uuid) to authenticated;
notify pgrst, 'reload schema';
commit;
