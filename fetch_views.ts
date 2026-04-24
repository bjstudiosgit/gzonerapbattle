import fs from "fs";

async function fetchViews() {
  const battlesPath = "src/data/battles.ts";
  let source = fs.readFileSync(battlesPath, "utf8");
  const videoIds = Array.from(source.matchAll(/youtube-nocookie\.com\/embed\/([^"]+)/g), match => match[1]);

  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  for (const id of videoIds) {
    const url = `https://returnyoutubedislikeapi.com/votes?videoId=${id}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      const views = formatViews(Number(json.viewCount));
      const videoLine = `"videoUrl": "https://www.youtube-nocookie.com/embed/${id}",`;
      const viewsLinePattern = new RegExp(`(${escapeRegExp(videoLine)}\\r?\\n\\s*"views":\\s*")[^"]+(")`);
      const insertViewsPattern = new RegExp(`(${escapeRegExp(videoLine)})(\\r?\\n)`);

      if (viewsLinePattern.test(source)) {
        source = source.replace(viewsLinePattern, `$1${views}$2`);
      } else {
        source = source.replace(insertViewsPattern, `$1$2    "views": "${views}",$2`);
      }

      console.log(`${id}: ${views}`);
    } catch (e) {
      console.log(`${id}: Error`);
    }
  }

  source = source.replace(/export const lastUpdated = "[^"]+";/, `export const lastUpdated = "${today}";`);
  fs.writeFileSync(battlesPath, source);
}

fetchViews();
