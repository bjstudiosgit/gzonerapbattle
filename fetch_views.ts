import fs from "fs";

const formatViews = (views: number) => {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function updateFileViews(filePath: string, idRegex: RegExp, makeVideoLine: (id: string) => string) {
  if (!fs.existsSync(filePath)) return;
  let source = fs.readFileSync(filePath, "utf8");
  const videoIds = Array.from(source.matchAll(idRegex), match => match[1]);

  for (const id of videoIds) {
    const url = `https://returnyoutubedislikeapi.com/votes?videoId=${id}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (!json || typeof json.viewCount !== "number") continue;
      const views = formatViews(Number(json.viewCount));
      const videoLine = makeVideoLine(id);
      const viewsLinePattern = new RegExp(`(${escapeRegExp(videoLine)}[^}]*?"?views"?:\\s*")[^"]+(")`);

      if (viewsLinePattern.test(source)) {
        source = source.replace(viewsLinePattern, `$1${views}$2`);
      }

      console.log(`[${filePath}] ${id}: ${views}`);
    } catch {
      console.log(`[${filePath}] ${id}: Error`);
    }
  }

  fs.writeFileSync(filePath, source);
}

async function fetchViews() {
  console.log("=== Updating Battles Views ===");
  const battlesPath = "src/data/battles.ts";
  let battlesSource = fs.readFileSync(battlesPath, "utf8");
  const videoIds = Array.from(battlesSource.matchAll(/youtube-nocookie\.com\/embed\/([^"?]+)/g), match => match[1]);

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
      if (!json || typeof json.viewCount !== "number") continue;
      const views = formatViews(Number(json.viewCount));
      const videoLine = `"videoUrl": "https://www.youtube-nocookie.com/embed/${id}",`;
      const viewsLinePattern = new RegExp(`(${escapeRegExp(videoLine)}\\r?\\n\\s*"views":\\s*")[^"]+(")`);
      const insertViewsPattern = new RegExp(`(${escapeRegExp(videoLine)})(\\r?\\n)`);

      if (viewsLinePattern.test(battlesSource)) {
        battlesSource = battlesSource.replace(viewsLinePattern, `$1${views}$2`);
      } else {
        battlesSource = battlesSource.replace(insertViewsPattern, `$1$2    "views": "${views}",$2`);
      }

      console.log(`[battles.ts] ${id}: ${views}`);
    } catch {
      console.log(`[battles.ts] ${id}: Error`);
    }
  }

  battlesSource = battlesSource.replace(/export const lastUpdated = "[^"]+";/, `export const lastUpdated = "${today}";`);
  fs.writeFileSync(battlesPath, battlesSource);

  console.log("\n=== Updating Street Freestyles Views ===");
  await updateFileViews(
    "src/pages/GzoneStreetFreestyles.tsx",
    /videoId:\s*"([^"]+)"/g,
    id => `videoId: "${id}",`
  );

  console.log("\n=== Updating Cyphers Views ===");
  await updateFileViews(
    "src/pages/GzoneCyphers.tsx",
    /videoId:\s*"([^"]+)"/g,
    id => `videoId: "${id}",`
  );

  console.log("\nViews update complete!");
}

fetchViews();
