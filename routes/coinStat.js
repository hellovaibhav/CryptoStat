import express from "express";

const router =  express.Router();

router.post("/stat", stat);

export default router;