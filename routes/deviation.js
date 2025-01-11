import express from "express";
import { deviation } from "../controllers/deviation.js";

const router =  express.Router();

router.post("/", deviation);

export default router;