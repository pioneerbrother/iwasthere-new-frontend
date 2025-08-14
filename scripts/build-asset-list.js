// File: new-frontend/scripts/build-asset-list.js
import fs from 'fs';
import axios from 'axios';

const GECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const OUTPUT_PATH = 'src/data/assetList.json';

async function fetchTopAssets() {
  console.log('Fetching top 150 crypto assets from CoinGecko...');
  try {
    const response = await axios.get(GECKO_API_URL, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 150, // Fetch more than 100 to have a good selection
        page: 1,
        sparkline: false
      }
    });

    // We only need the id, symbol, and name for our list.
    const assetList = response.data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name
    }));
    
    // Ensure the output directory exists
    fs.mkdirSync('src/data', { recursive: true });
    // Save the formatted list to a JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(assetList, null, 2));
    
    console.log(`SUCCESS: Successfully saved ${assetList.length} assets to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('--- FATAL ERROR: Failed to fetch asset list from CoinGecko ---');
    console.error(error.message);
    process.exit(1); // Exit with an error code to stop the build process
  }
}

fetchTopAssets();