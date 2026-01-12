import express from 'express';
import { authUserMiddleware } from '../middlewares/auth.middleware.js';
import { logEvent } from '../services/event.service.js';

const router = express.Router();

/**
 * Watch Event
 */

router.post("/watch",authUserMiddleware,async(req,res)=>{
    const {foodId,value}=req.body;
    await logEvent({
        userId:req.user._id,
        foodId,
        eventType:"watch",
        value
    });
    res.json({success:true});
});
/**
 * Like Event
 */
router.post("/like",authUserMiddleware,async(req,res)=>{
    const {foodId,value}=req.body;
    await logEvent({
        userId:req.user._id,
        foodId,
        eventType:"like"
    });
    res.json({success:true});
});

/**
 * Save Point
 */
router.post("/save",authUserMiddleware,async(req,res)=>{
    const {foodId,value}=req.body;
    await logEvent({
        userId:req.user._id,
        foodId,
        eventType:"save",
    });
    res.json({success:true});
});

export default router;