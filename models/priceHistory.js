import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
    coinId:{
        type: mongoose.Schema.Types.ObjectId,
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

const PriceHistory = mongoose.model("PriceHistory", priceHistorySchema);