import express from "express";
import {statUpdate} from "../services/cronVercel.js";

const router =  express.Router();

router.get("/statUpdate", statUpdate );

export default router;