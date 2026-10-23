import { writeFileSync } from 'node:fs';
import { museumItems } from '../src/data/museum';
const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
const rows = museumItems.filter(item => !/\bcrack\b/i.test(item.name)).map(item => `(${quote(item.id)}, ${quote(item.name)}, 'open', 99, 20)`);
writeFileSync('supabase/museum-auctions-seed.sql', `-- Approved starting price: 99p. No closing date set yet.\n-- Never reprice or reopen an existing auction when this is rerun.\n-- Preserve catalogue prop order: item IDs are used by bids.\nbegin;\ninsert into public.museum_auctions(item_id,item_name,status,starting_pence,increment_pence) values\n${rows.join(',\n')}\non conflict (item_id) do nothing;\ncommit;\n`);
console.log(`Prepared ${rows.length} listings at 99p; restricted item remains archive-only.`);
