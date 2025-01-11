import mongoose from "mongoose";
import Coin from "../models/coins.js";
import PriceHistory from "../models/priceHistory.js";



export const addCoin = async (req, res) => {
    try {
        const { coinName, coinSymbol: symbol } = req.body;

        // Check if the coin exists
        console.log("trying to add coin with symbol: "+symbol);
        console.log("checking database connection status: "+mongoose.connection.readyState);
        let foundCoin;
        try{
         foundCoin = await Coin.findOne({ symbol });
        }
        catch(err){
            console.log(err);
        }
        if (foundCoin) {
            return res.status(400).json({ message: "Coin already exists" });
        }

        // Create and save the coin
        const newCoin = new Coin({
            coinName,
            symbol,
            standardDeviation: 0.0,
            standardDeviationCreatedAt: Date.now(),
        });

        const url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_market_cap=true&include_24hr_change=true&ids=`+symbol;
        // console.log(url);
        const options = { method: 'GET', headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY } };
        let op;
        await fetch(url, options)
            .then(res => res.json())
            .then(json => op = json)
            .catch(err => console.error(err));


            
        const coinStat = new PriceHistory({
            symbol:symbol,
            price:op[symbol].usd,
            marketCap:op[symbol].usd_market_cap,
            change24h:op[symbol].usd_24h_change
        });

        const [createdCoin,createdStat] = await Promise.all([newCoin.save(),coinStat.save()]);

        res.status(200).json({ message: "Coin added successfully", coin: createdCoin, firstStat: createdStat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
