begin;
alter table public.museum_auctions alter column increment_pence set default 20;
update public.museum_auctions set increment_pence = 20;
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
  select * into highest from public.museum_bids where item_id = auction_item order by amount_pence desc limit 1;
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

notify pgrst, 'reload schema';
commit;
