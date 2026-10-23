# gBay / Gzone Museum BETA

Uses the existing Backstage Supabase project and Google membership. No new credentials or packages are needed.

## Setup

Run `museum-auctions.sql` once, then `museum-auctions-seed.sql` in Supabase SQL Editor. Both have been applied to project `gzbiqhftbsqmdcofodhl` during this implementation. Do not rerun the schema creation. The seed is safe to rerun: it never changes existing listings or bids.

There are 39 archive items and 38 open listings, starting at 99p with Âexact 20p increases. The item described as crack is archive-only and excluded from the seed. Closing dates are unset until the organiser chooses them. No payment processing, automatic winner messages or shipping checkout is included.

The incremental migration `museum-fun-bids.sql` updates existing listings to 20p steps and rejects any amount other than the exact next bid. Existing bids are preserved.

## Manage listings

In Supabase Table Editor, `museum_auctions` holds the starting price, increment, status, closing date, condition, collection details and optional `image_url`. Prices are integer pennies. Use an HTTPS image URL or a site-relative image path; illustrations are labelled until actual photos are supplied.

Set `ends_at` to the closing timestamp with an explicit time zone. Bids are rejected after that time even if the page has an older price. Set status to `cancelled` to withdraw a listing while preserving its history, or `closed` to end it manually. Drafts do not appear in the public auction feed. Keep item IDs stable: they are based on battle slug and the original prop index, so do not reorder battle props after bidding starts.

Bidding is just for fun, with no commitment to buy and no payment taken. Review availability, condition, collection and closing details before announcing the auction publicly. Arrange completion with the member separately. The UI does not claim an item has been won or paid for.

## Validation

`museum-auctions-check.sql` creates isolated fixtures inside a transaction and rolls them all back. It checks minimums, increments, retry idempotency, own overbids, member privacy, blocked direct writes, closed auctions and guest restrictions. The script passed in the configured project. No test bids remain.

All writes go through the authenticated `place_museum_bid` function, using the signed-in identity. Members cannot directly read or write bid tables. An auction row lock serialises bids; a per-member transaction lock protects retries and rate limiting. Public results exclude member IDs. Review references: https://supabase.com/docs/guides/database/functions and https://www.postgresql.org/docs/16/explicit-locking.html.

Bid retraction: museum-bid-retraction.sql adds an account-owned retract function and preserves withdrawn bids in history. Public price and bid count include active bids only. If all bids are withdrawn, the next bid returns to the starting price. Retraction is available at any time because bids are for fun. Apply incremental migrations in order; do not reapply the older fun-bids function after the retraction migration.
