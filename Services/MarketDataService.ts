// services/marketDataService.ts
import { CoinGeckoAPI, KrakenAPI } from './apiClients';

export class RealMarketDataService {
  static async fetchXIONPrice(): Promise<number> {
    try {
      // Try CoinGecko first
      const coingeckoData = await CoinGeckoAPI.getCoinData('xion');
      if (coingeckoData?.price) return coingeckoData.price;
      
      // Fallback to Kraken
      const krakenData = await KrakenAPI.getTicker('XIONUSD');
      return krakenData.price || 5.10; // Default fallback
    } catch (error) {
      console.error('XION price fetch failed, using fallback:', error);
      return 5.10;
    }
  }

  static async fetchAllMarketData() {
    const [btc, eth, xion] = await Promise.all([
      this.fetchBTCData(),
      this.fetchETHData(), 
      this.fetchXIONPrice()
    ]);
    
    return {
      bitcoin: { price: btc.price, change: btc.change },
      ethereum: { price: eth.price, change: eth.change },
      xion: { price: xion, change: await this.getXIONChange() }
    };
  }
}


export class MarketDataService {
  private async fetchWithFallback(url: string) {
    try {
      // Remove client-side API key exposure
      const response = await fetch(`/api/market-data?url=${encodeURIComponent(url)}`);
      return await response.json();
    } catch (error) {
      console.error('API fetch failed:', error);
      return this.getMockData(); // Use consistent fallback
    }
  }
}

// Add this API route: pages/api/market-data.ts
export default async function handler(req, res) {
  const { url } = req.query;
  const apiKey = process.env.FMP_API_KEY; // Server-side only
  
  try {
    const response = await fetch(`${url}&apikey=${apiKey}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Market data fetch failed' });
  }
}
