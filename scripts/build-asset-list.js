// File: iwasthere/new-frontend/scripts/build-asset-list.js
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
        per_page: 150,
        page: 1,
        sparkline: false
      }
    });

    const assetList = response.data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name
    }));
    
    fs.mkdirSync('src/data', { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(assetList, null, 2));
    
    console.log(`SUCCESS: Saved ${assetList.length} assets to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('--- FATAL ERROR: Failed to fetch asset list from CoinGecko ---');
    console.error(error.message);
    process.exit(1);
  }
}

fetchTopAssets();