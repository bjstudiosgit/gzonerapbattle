import fs from 'fs';

async function fetchViews() {
  const videoIds = [
    "09ZD_UjdoVw", // Deeno vs Tapped24
    "QByqdZAF3L0", // PR1NC3 vs Roman
    "RhC2D3ftzZo", // LDN Mikez vs Deluxx
    "NEiGspeXLYM", // LDN Mikez vs 2MWAD
    "T0zo6YgfxB4", // CJ Zino vs Proty
    "bZRy8jgPvwk", // Renzo vs Proty
    "Asvv9rzqXDI", // Deluxx vs Btizz
    "HfO3UR_Zeyk", // 2MWAD vs Ryno
    "OGagI2K6StY", // Tapped24 vs Roman
    "oUDDrQtoTHM", // Tapped24 vs AJNA
    "Omge-TNTrhQ", // Ryno vs Tymeless
    "Rs3kTPbnUm4", // PR1NC3 vs NattyEBK
    "-bKXRy3RxoY", // Btizz vs CJ Zino
    "OuVeBAU1OQQ"  // Deeno vs Grams
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
