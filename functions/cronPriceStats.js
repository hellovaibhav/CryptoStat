import Coin from "../models/coins.js"; 
import PriceHistory from "../models/priceHistory.js";
import { dbConnect } from "../services/dbConnection.js";


export const cronPriceStats = async () => {
    try{

        dbConnect();
        const coins = await Coin.find({}, { symbol: 1, _id: 0 });
        const cryptoIds = coins.map((coin) => coin.symbol);
        if (cryptoIds.length === 0) {
            console.log("No cryptocurrencies found in the database.");
            return;
        }

        const url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_market_cap=true&include_24hr_change=true&ids=${cryptoIds.join(",")}`;
       
        const options = { method: 'GET', headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY } };
        let op;
        await fetch(url, options)
            .then(res => res.json())
            .then(json => op = json)
            .catch(err => console.error(err));

            for(let coin of cryptoIds)
            {
                const coinStat = new PriceHistory({
                            symbol:coin,
                            price:op[coin].usd,
                            marketCap:op[coin].usd_market_cap,
                            change24h:op[coin].usd_24h_change
                        });
                await coinStat.save();

                        // const createdStat = await coinStat.save();
            }

            console.log("Price stats added successfully at ", new Date());

            return;


    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};
