import mongoose from "mongoose";
import Coin from "../models/coins.js";
import PriceHistory from "../models/priceHistory.js";

// const coinModel = mongoose.model("Coin");
const statModel = mongoose.model("PriceHistory");

export const addCoin = async(req,res)=>{
    try{
        
        const coinName = req.body.coinName;
        const symbol = req.body.coinSymbol;

        const foundCoin = await Coin.findOne({symbol:symbol});
        if(foundCoin){
            return res.status(400).json({message:"Coin already exists"});
        }

        const newCoin = new Coin({
            coinName:coinName,
            symbol:symbol,
        standardDeviation:0.0,
            standardDeviationCreatedAt:Date.now()});
        const createdCoin  = await newCoin.save();
            console.log(createdCoin);

            const url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_market_cap=true&include_24hr_change=true&ids=`+symbol;
        console.log(url);
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

        const createdStat = await coinStat.save();

        console.log(createdStat);
        res.status(200).json({message:"Coin added successfully", coin:createdCoin});


    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}