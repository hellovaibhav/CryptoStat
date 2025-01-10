import express from "express";
import { coinStat } from "../controllers/stats.js";

const router =  express.Router();

router.post("/stats", coinStat);

export default router;