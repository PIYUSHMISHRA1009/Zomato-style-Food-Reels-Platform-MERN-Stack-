import Food from "../models/food.model.js";

/**
 * Phase 1.2:
 * User-aware feed (no ranking yet)
 */
export const getUserFeed= async(req,res)=>{
   try{ 
    const userId=req.user._id;
    
    //fetch all foods except user's own uploads
    const foods=await Food.find({
        foodPartner:{$ne:userId}
    }).sort({createdAt:-1});
    
    res.json({
        success:true,
        foodItems:foods  // Changed from 'data' to 'foodItems' to match frontend
    });
    } catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Failed to load feed"
        });
     }
};
/**
 * { foodPartner: { $ne: userId } }
This means:

users don’t see their own uploads

food partners don’t inflate engagement

feed feels natural

This is real product logic.
 */