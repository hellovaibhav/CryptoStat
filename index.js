import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";


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

  app.listen(port, () => {
    connect();
    console.log(`Server is up and runnning on port ${port}`);
  });