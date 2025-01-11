import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cron from "node-cron";


// route imports

import coinStat from "./routes/coinStat.js";
import addCoin from "./routes/addCoin.js";
import deviation from "./routes/deviation.js";
import { cronPriceStats } from "./functions/cronPriceStats.js";

const app = express();

dotenv.config();


const port = process.env.PORT || 5000;

app.use(express.json());

const connect = () => {
    try {
      mongoose.connect(process.env.MONGO_URL);
      console.log("Connected to database");
    } catch (err) {
      throw err;
    }
  };

  mongoose.connection.on("disconnected", () => {
    console.log("Database is disconnected");
  });


// cron job to update the standard deviation of the coins

cron.schedule('* * */2 * * *', cronPriceStats);
  

app.use("/stats", coinStat);
app.use("/addCoin", addCoin);
app.use("/deviation", deviation);


app.use("/", (req,res)=>{
  res.status(200).json({message:"Hello world"});
});

  app.listen(port, () => {
    connect();
    console.log(`Server is up and runnning on port ${port}`);
  });