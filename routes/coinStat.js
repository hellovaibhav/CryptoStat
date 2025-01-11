import express from "express";
import { coinStat } from "../controllers/stats.js";

const router =  express.Router();

router.post("/", coinStat);

export default router;