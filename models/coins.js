import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
    coinName: {
        type: String,
        required: true,
        unique: true,
    },
    symbol: {
        type: String,
        required: true,
        unique: true,
    },
    standardDeviation: {
        type: Number,
    },
    standardDeviationCreatedAt:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },

});

export default mongoose.model("Coin", coinSchema);