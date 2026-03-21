import fs from 'fs';

async function fetchViews() {
  const urls = [
    "https://www.youtube.com/watch?v=09ZD_UjdoVw",
    "https://www.youtube.com/watch?v=QByqdZAF3L0",
    "https://www.youtube.com/watch?v=RhC2D3ftzZo",
    "https://www.youtube.com/watch?v=NEiGspeXLYM",
    "https://www.youtube.com/watch?v=T0zo6YgfxB4",
    "https://www.youtube.com/watch?v=bZRy8jgPvwk",
    "https://www.youtube.com/watch?v=Asvv9rzqXDI",
    "https://www.youtube.com/watch?v=HfO3UR_Zeyk",
    "https://www.youtube.com/watch?v=OGagI2K6StY",
    "https://www.youtube.com/watch?v=oUDDrQtoTHM"
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const match = text.match(/"viewCount":"(\d+)"/);
      if (match) {
        console.log(`${url}: ${match[1]}`);
      } else {
        console.log(`${url}: Not found`);
      }
    } catch (e) {
      console.log(`${url}: Error`);
    }
  }
}

fetchViews();
