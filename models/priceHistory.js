import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
    symbol:{
        type: String,
        ref:"Coin",
        required:true,
    },
    price:{
        type: Number,
        required:true,
    },
    marketCap:{
        type:Number,
        required:true,
    },
    change24h:{
        type:Number,
        required:true,
    },
    fetchedAt:{
        type:Date,
        default:Date.now,
    },
});

export default mongoose.model("PriceHistory", priceHistorySchema);