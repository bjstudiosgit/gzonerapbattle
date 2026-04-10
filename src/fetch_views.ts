import fs from 'fs';

async function fetchViews() {
  const videoIds = [
    "09ZD_UjdoVw",
    "QByqdZAF3L0",
    "RhC2D3ftzZo",
    "NEiGspeXLYM",
    "T0zo6YgfxB4",
    "bZRy8jgPvwk",
    "Asvv9rzqXDI",
    "HfO3UR_Zeyk",
    "OGagI2K6StY",
    "oUDDrQtoTHM"
  ];

  for (const id of videoIds) {
    const url = `https://returnyoutubedislikeapi.com/votes?videoId=${id}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      console.log(`${id}: ${json.viewCount}`);
    } catch (e) {
      console.log(`${id}: Error`);
    }
  }
}

fetchViews();
