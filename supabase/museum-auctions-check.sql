-- Disposable database checks: all fixtures are rolled back, including on failure.
begin;
insert into auth.users(id) values ('f9ba0000-0000-4000-8000-000000000001'), ('f9ba0000-0000-4000-8000-000000000002');
insert into public.backstage_profiles(user_id, username) values ('f9ba0000-0000-4000-8000-000000000001','gbay_check_one'),('f9ba0000-0000-4000-8000-000000000002','gbay_check_two');
insert into public.museum_auctions(item_id,item_name,status) values ('gbay-check-only','Disposable test','open');
set local role authenticated;
select set_config('request.jwt.claim.sub','f9ba0000-0000-4000-8000-000000000001',true);
do $$ begin
  begin perform public.place_museum_bid('gbay-check-only',98,gen_random_uuid()); raise exception 'TEST FAILED: below minimum accepted';
  exception when others then if sqlerrm not like 'Use the exact next bid shown%' then raise; end if; end;
end $$;
select public.place_museum_bid('gbay-check-only',99,'f9ba0000-0000-4000-8000-000000000011');
select public.place_museum_bid('gbay-check-only',99,'f9ba0000-0000-4000-8000-000000000011');
do $$ begin
  if (select count(*) from public.get_my_museum_bids()) <> 1 then raise exception 'TEST FAILED: retry duplicated'; end if;
  begin perform public.place_museum_bid('gbay-check-only',119,gen_random_uuid()); raise exception 'TEST FAILED: own overbid accepted';
  exception when others then if sqlerrm not like 'You already hold%' then raise; end if; end;
  begin perform 1 from public.museum_bids; raise exception 'TEST FAILED: direct read allowed'; exception when insufficient_privilege then null; end;
  begin insert into public.museum_bids(id,item_id,amount_pence) values(gen_random_uuid(),'gbay-check-only',500); raise exception 'TEST FAILED: direct write allowed'; exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','f9ba0000-0000-4000-8000-000000000002',true);
do $$ begin
  if (select count(*) from public.get_my_museum_bids()) <> 0 then raise exception 'TEST FAILED: private bids leaked'; end if;
  begin perform public.place_museum_bid('gbay-check-only',10000,gen_random_uuid()); raise exception 'TEST FAILED: oversized bid accepted';
  exception when others then if sqlerrm not like 'Use the exact next bid shown%' then raise; end if; end;
  begin perform public.place_museum_bid('gbay-check-only',100,gen_random_uuid()); raise exception 'TEST FAILED: increment ignored';
  exception when others then if sqlerrm not like 'Use the exact next bid shown%' then raise; end if; end;
end $$;
select public.place_museum_bid('gbay-check-only',119,'f9ba0000-0000-4000-8000-000000000012');
do $$ begin
  if not (select is_leading and current_pence=119 and bid_count=2 from public.get_museum_auctions() where item_id='gbay-check-only') then raise exception 'TEST FAILED: public price wrong'; end if;
end $$;
select set_config('request.jwt.claim.sub','f9ba0000-0000-4000-8000-000000000001',true);
do $$ begin
  if not (select not is_my_lead and current_pence=119 from public.get_my_museum_bids()) then raise exception 'TEST FAILED: outbid state wrong'; end if;
end $$;
do $$ begin
  begin perform public.retract_museum_bid('f9ba0000-0000-4000-8000-000000000012'); raise exception 'TEST FAILED: other member retracted';
  exception when others then if sqlerrm not like 'This bid is not available%' then raise; end if; end;
end $$;
select set_config('request.jwt.claim.sub','f9ba0000-0000-4000-8000-000000000002',true);
select public.retract_museum_bid('f9ba0000-0000-4000-8000-000000000012');
select public.retract_museum_bid('f9ba0000-0000-4000-8000-000000000012');
do $$ begin
  if not (select current_pence=99 and bid_count=1 from public.get_museum_auctions() where item_id='gbay-check-only') then raise exception 'TEST FAILED: fallback price wrong'; end if;
  if not (select status='retracted' from public.get_my_museum_bids()) then raise exception 'TEST FAILED: retraction history wrong'; end if;
end $$;
select set_config('request.jwt.claim.sub','f9ba0000-0000-4000-8000-000000000001',true);
select public.retract_museum_bid('f9ba0000-0000-4000-8000-000000000011');
do $$ begin
  if not (select current_pence is null and bid_count=0 from public.get_museum_auctions() where item_id='gbay-check-only') then raise exception 'TEST FAILED: empty price wrong'; end if;
  if not (select status='retracted' and current_pence=99 from public.get_my_museum_bids()) then raise exception 'TEST FAILED: empty history missing'; end if;
end $$;
reset role;
update public.museum_auctions set status='closed' where item_id='gbay-check-only';
set local role authenticated;
do $$ begin
  begin perform public.place_museum_bid('gbay-check-only',139,gen_random_uuid()); raise exception 'TEST FAILED: closed auction accepted';
  exception when others then if sqlerrm not like 'Bidding is not open%' then raise; end if; end;
end $$;
reset role;
set local role anon;
do $$ begin
  begin perform public.place_museum_bid('gbay-check-only',139,gen_random_uuid()); raise exception 'TEST FAILED: anonymous bid allowed'; exception when insufficient_privilege then null; end;
  begin perform public.get_my_museum_bids(); raise exception 'TEST FAILED: anonymous history allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: retraction ownership, retry, fallback, empty price, history, minimum, increment, duplicate retry, ownership, privacy, direct writes, closed auction and guest restrictions. Fixtures rolled back.' as result;
