import PriceHistory from "../models/priceHistory.js";
import Coin from "../models/coins.js";
import { dbConnect } from "../services/dbConnection.js";
export const deviation = async (req,res) => {
    try {
        dbConnect();

        const coinInfo = await Coin.findOne({symbol:req.body.coin});

        if(new Date()-coinInfo.standardDeviationCreatedAt < 2*60*60*1000){
            console.log("Using cached standard deviation");
            return res.status(200).json({deviation:coinInfo.standardDeviation});
        }

        console.log(req.body.coin);
        const result = await PriceHistory.aggregate([
            { $match: { symbol: req.body.coin } }, 
            { $sort: { fetchedAt: -1 } },      
            { $limit: 100 },                  
            {
                $group: {
                    _id: null,               
                    stdDev: { $stdDevSamp: "$price" }, 
                },
            },
        ]);
        // console.log(result);

        coinInfo.standardDeviation = result[0].stdDev;
        coinInfo.standardDeviationCreatedAt = Date.now(); 
        coinInfo.save();
        return res.status(200).json({deviation:coinInfo.standardDeviation});
    } catch (error) {
        console.error("Error calculating standard deviation:", error);
        throw new Error("Failed to calculate standard deviation");
    }
};