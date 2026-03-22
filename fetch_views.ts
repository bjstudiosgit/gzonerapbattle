import fs from 'fs';
import path from 'path';

const BATTLES_PATH = path.join(process.cwd(), 'src', 'data', 'battles.ts');

function formatViews(views: number): string {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toString();
}

async function fetchViews() {
  console.log('Fetching YouTube views...');
  
  const content = fs.readFileSync(BATTLES_PATH, 'utf-8');
  // Simple regex to extract the array content. This is fragile but works for this specific file structure.
  const arrayMatch = content.match(/export const battles: Battle\[] = (\[[\s\S]*?]);/);
  
  if (!arrayMatch) {
    console.error('Could not find battles array in src/data/battles.ts');
    return;
  }

  let battles = eval(arrayMatch[1].replace(/export /g, ''));

  for (const battle of battles) {
    if (battle.videoUrl && !battle.isUnreleased) {
      const videoId = battle.videoUrl.split('/').pop();
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const text = await response.text();
        
        // Try multiple regex patterns for view count
        const patterns = [
          /"viewCount":"(\d+)"/,
          /viewCount\\":\\"(\d+)\\"/,
          /(\d+) views/
        ];
        
        let match = null;
        for (const pattern of patterns) {
          match = text.match(pattern);
          if (match) break;
        }
        
        if (match) {
          const newViews = formatViews(parseInt(match[1].replace(/,/g, '')));
          console.log(`Updated ${battle.title}: ${battle.views} -> ${newViews}`);
          battle.views = newViews;
        } else {
          console.log(`Could not find view count for ${battle.title}`);
        }
      } catch (e) {
        console.error(`Error fetching views for ${battle.title}:`, e);
      }
    }
  }

  const updatedContent = content.replace(
    /export const battles: Battle\[] = (\[[\s\S]*?]);/,
    `export const battles: Battle[] = ${JSON.stringify(battles, null, 2)};`
  );

  fs.writeFileSync(BATTLES_PATH, updatedContent);
  console.log('Successfully updated src/data/battles.ts');
}

fetchViews();
