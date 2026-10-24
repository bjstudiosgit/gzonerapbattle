import { backstageClient } from './backstage';

export type MuseumAuction = {
  item_id: string; item_name: string; status: 'open' | 'closed' | 'cancelled';
  starting_pence: number; increment_pence: number; starts_at: string; ends_at: string | null;
  condition_note: string; collection_note: string; image_url: string | null;
  current_pence: number | null; bid_count: number; is_leading: boolean; server_time: string;
};
export type MuseumBid = {
  id: string; item_id: string; item_name: string; amount_pence: number; created_at: string;
  current_pence: number; status: string; ends_at: string | null; is_highest: boolean; is_my_lead: boolean;
};
export const money = (pence: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
export function auctionOpen(auction: MuseumAuction | undefined, now: number) {
  return Boolean(auction && auction.status === 'open' && Date.parse(auction.starts_at) <= now && (!auction.ends_at || Date.parse(auction.ends_at) > now));
}
export const minimumBid = (auction: MuseumAuction) => auction.current_pence === null ? auction.starting_pence : auction.current_pence + auction.increment_pence;
export async function getMuseumAuctions(): Promise<MuseumAuction[]> {
  const { data, error } = await backstageClient().rpc('get_museum_auctions');
  if (error) throw new Error('Live bids are temporarily unavailable. Please try again.');
  return data ?? [];
}
export async function placeMuseumBid(item: string, pence: number, requestId: string) {
  const { error } = await backstageClient().rpc('place_museum_bid', { auction_item: item, bid_pence: pence, request_id: requestId });
  if (error) throw new Error(error.code === 'P0001' ? error.message : 'We couldn’t confirm your bid. Retry the same bid to check it safely.');
}
export async function getMyMuseumBids(): Promise<MuseumBid[]> {
  const { data, error } = await backstageClient().rpc('get_my_museum_bids');
  if (error) throw new Error('Your bids couldn’t load. Please try again.');
  return data ?? [];
}
export async function retractMuseumBid(bidId: string) {
  const { error } = await backstageClient().rpc('retract_museum_bid', { bid_id: bidId });
  if (error) throw new Error(error.code === 'P0001' ? error.message : 'Your bid could not be retracted. Please try again.');
}
export const museumReturnKey = 'gzone.museum.return';
export function rememberMuseumItem(itemId: string) {
  sessionStorage.setItem(museumReturnKey, `/gingabay?item=${encodeURIComponent(itemId)}`);
}
export function pendingMuseumReturn() {
  const path = sessionStorage.getItem(museumReturnKey);
  return path && /^\/gingabay\?item=[a-zA-Z0-9%_-]+$/.test(path) ? path : null;
}
