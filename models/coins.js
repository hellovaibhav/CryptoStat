import mongoose from mongoose;

const coinSchema = new mongoose.Schema({
    coinName: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
        unique: true,
    },
    standardDeviation: {
        type: Number,
        required: true,
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

const Coin = mongoose.model("Coin", coinSchema);