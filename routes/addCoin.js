import express from "express";
import { addCoin } from "../controllers/coins.js";

const router =  express.Router();

router.post("/", addCoin);

export default router;