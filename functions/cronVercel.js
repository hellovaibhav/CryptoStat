import Coin from "../models/coins.js"; 
import PriceHistory from "../models/priceHistory.js";
import { dbConnect } from "../services/dbConnection.js";

export default async function handler(req, res) {
  try {
   
    await dbConnect();

   
    const coins = await Coin.find({}, { symbol: 1, _id: 0 });
    const cryptoIds = coins.map((coin) => coin.symbol);

    if (cryptoIds.length === 0) {
      console.log("No cryptocurrencies found in the database.");
      return res.status(400).json({ message: "No cryptocurrencies found." });
    }

   
    const url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_market_cap=true&include_24hr_change=true&ids=${cryptoIds.join(",")}`;
    const options = {
      method: 'GET', 
      headers: {
        accept: 'application/json', 
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
      }
    };

    let op;
    try {
      const response = await fetch(url, options);
      op = await response.json();
    } catch (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: "Error fetching data from CoinGecko" });
    }

   
    const coinStats = [];
    for (let coin of cryptoIds) {
      if (op[coin]) { 
        const coinStat = new PriceHistory({
          symbol: coin,
          price: op[coin]?.usd,
          marketCap: op[coin]?.usd_market_cap,
          change24h: op[coin]?.usd_24h_change,
        });
        coinStats.push(coinStat.save()); // Collect all save promises
      } else {
        console.log(`No data for coin: ${coin}`);
      }
    }

    
    await Promise.all(coinStats);

    console.log("Price stats added successfully at", new Date());

    
    res.status(200).json({ message: `Cron job fetched data at ${new Date()}` });

  } catch (error) {
    console.error("Error in cron job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
