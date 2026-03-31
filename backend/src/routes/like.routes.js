import express from "express";
import {toggleLike} from "../controllers/like.controller.js";
import {authUserMiddleware} from "../middlewares/auth.middleware.js";

const router =express.Router();

router.post("/toggle",authUserMiddleware,toggleLike);

export default router;