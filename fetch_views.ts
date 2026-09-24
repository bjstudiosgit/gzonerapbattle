import fs from "fs";

const formatViews = (views: number) => {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function getYouTubeViews(id: string): Promise<number | undefined> {
  const response = await fetch(`https://www.youtube.com/watch?v=${id}`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) return;
  const playerJson = (await response.text()).match(/var ytInitialPlayerResponse\s*=\s*(\{.*?\});/s)?.[1];
  if (!playerJson) return;
  const details = JSON.parse(playerJson).videoDetails;
  if (details?.videoId !== id || !/^\d+$/.test(details.viewCount)) return;
  return Number(details.viewCount);
}

let failedRefreshes = 0;

async function updateFileViews(filePath: string, idRegex: RegExp, makeVideoLine: (id: string) => string) {
  if (!fs.existsSync(filePath)) return;
  let source = fs.readFileSync(filePath, "utf8");
  const videoIds = Array.from(source.matchAll(idRegex), match => match[1]);

  for (const id of videoIds) {
    const url = `https://returnyoutubedislikeapi.com/votes?videoId=${id}`;
    try {
      // Prefer YouTube's public count; the third-party count can lag new uploads.
      let youtubeViews: number | undefined;
      try {
        youtubeViews = await getYouTubeViews(id);
      } catch {
        // Fall back to the existing provider when YouTube is unavailable.
      }
      const savedViews = source.match(new RegExp(`${escapeRegExp(makeVideoLine(id))}[^}]*?"?views"?:\\s*"([^"]+)"`))?.[1];
      const savedCount = savedViews ? parseFloat(savedViews) * (savedViews.endsWith("K") ? 1000 : 1) : 0;
      if (youtubeViews !== undefined) {
        const pattern = new RegExp(`(${escapeRegExp(makeVideoLine(id))}[^}]*?"?views"?:\\s*")[^"]+(")`);
        if (!pattern.test(source)) throw new Error("View field missing");
        source = source.replace(pattern, `$1${formatViews(youtubeViews)}$2`);
        console.log(`[${filePath}] ${id}: ${formatViews(youtubeViews)} (YouTube)`);
        continue;
      }
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      const json = await response.json();
      if (!response.ok || typeof json?.viewCount !== "number") throw new Error("Views unavailable");
      const views = formatViews(Math.max(savedCount, Number(json.viewCount)));
      const videoLine = makeVideoLine(id);
      const viewsLinePattern = new RegExp(`(${escapeRegExp(videoLine)}[^}]*?"?views"?:\\s*")[^"]+(")`);

      if (!viewsLinePattern.test(source)) throw new Error("View field missing");
      source = source.replace(viewsLinePattern, `$1${views}$2`);

      console.log(`[${filePath}] ${id}: ${views} (fallback${json.viewCount < savedCount ? "; retained newer saved count" : ""})`);
    } catch {
      failedRefreshes++;
      console.log(`[${filePath}] ${id}: Error — saved count retained`);
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
      const videoLine = `"videoUrl": "https://www.youtube-nocookie.com/embed/${id}",`;
      let youtubeViews: number | undefined;
      try {
        youtubeViews = await getYouTubeViews(id);
      } catch {
        // Keep the existing provider as a fallback when YouTube is unavailable.
      }
      let count = youtubeViews;
      let retained = false;
      if (count === undefined) {
        const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
        const json = await response.json();
        if (!response.ok || typeof json?.viewCount !== "number") throw new Error("Views unavailable");
        const savedViews = battlesSource.match(new RegExp(`${escapeRegExp(videoLine)}[^}]*?"views":\\s*"([^"]+)"`))?.[1];
        const savedCount = savedViews ? parseFloat(savedViews) * (savedViews.endsWith("K") ? 1000 : 1) : 0;
        retained = json.viewCount < savedCount;
        count = Math.max(savedCount, json.viewCount);
      }
      const views = formatViews(count);
      const viewsLinePattern = new RegExp(`(${escapeRegExp(videoLine)}\\r?\\n\\s*"views":\\s*")[^"]+(")`);
      const insertViewsPattern = new RegExp(`(${escapeRegExp(videoLine)})(\\r?\\n)`);

      if (viewsLinePattern.test(battlesSource)) {
        battlesSource = battlesSource.replace(viewsLinePattern, `$1${views}$2`);
      } else {
        battlesSource = battlesSource.replace(insertViewsPattern, `$1$2    "views": "${views}",$2`);
      }

      console.log(`[battles.ts] ${id}: ${views} (${youtubeViews !== undefined ? "YouTube" : retained ? "fallback; retained newer saved count" : "fallback"})`);
    } catch {
      failedRefreshes++;
      console.log(`[battles.ts] ${id}: Error — saved count retained`);
    }
  }

  if (failedRefreshes === 0) {
    battlesSource = battlesSource.replace(/export const lastUpdated = "[^"]+";/, `export const lastUpdated = "${today}";`);
  }
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

  console.log(failedRefreshes ? `\nPartial refresh: ${failedRefreshes} videos could not be refreshed.` : "\nViews update complete!");
  if (failedRefreshes) process.exitCode = 1;
}

fetchViews();
