import PriceHistory from "../models/priceHistory.js";
import Coin from "../models/coins.js";
import { dbConnect } from "../services/dbConnection.js";
import { calculateStandardDeviation } from "../functions/stdDeviation.js";

export const deviation = async (req, res) => {
    try {
        await dbConnect();

        const coinInfo = await Coin.findOne({ symbol: req.body.coin });

        console.log("cached info for ", coinInfo.symbol, "was saved at", coinInfo.standardDeviationCreatedAt);

        // Count the number of documents with the given symbol
    //     const recentDocuments = await PriceHistory.find({ symbol: req.body.coin })
    //     .sort({ fetchedAt: -1 })  // Sort by 'fetchedAt' in descending order (most recent first)
    //     .limit(100);  // Limit to 100 documents

    // console.log(`Fetched ${recentDocuments.length} recent documents for symbol: ${req.body.coin}`);

    // const stdDev = calculateStandardDeviation(recentDocuments);
    // console.log("manual std dev: ", stdDev);

    // If no documents found, return an error message
    // if (recentDocuments.length === 0) {
    //     return res.status(404).json({ message: "No recent documents found for this symbol" });
    // }

        // You can uncomment this if you want to use cached standard deviation
        if(new Date() - coinInfo.standardDeviationCreatedAt < 2*60*60*1000){
            console.log("Using cached standard deviation");
            return res.status(200).json({deviation: coinInfo.standardDeviation});
        }

        console.log(req.body.coin);
        const result = await PriceHistory.aggregate([
            { $match: { symbol: req.body.coin } },
            { $sort: { fetchedAt: -1 } },
            { $limit: 100 },
            {
                $group: {
                    _id: null,
                    deviation: { $stdDevSamp: "$price" },
                },
            },
        ]);
        console.log(result);

        coinInfo.standardDeviation = result[0].deviation;
        coinInfo.standardDeviationCreatedAt = Date.now();
        coinInfo.save();
        return res.status(200).json({ deviation: coinInfo.standardDeviation });
    } catch (error) {
        console.error("Error calculating standard deviation:", error);
        throw new Error("Failed to calculate standard deviation");
    }
};
