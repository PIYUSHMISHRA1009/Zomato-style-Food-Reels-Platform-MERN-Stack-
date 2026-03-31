import express from "express";
import {toggleSave} from "../controllers/save.controller.js";
import {authUserMiddleware} from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/toggle",authUserMiddleware,toggleSave);

export default router;