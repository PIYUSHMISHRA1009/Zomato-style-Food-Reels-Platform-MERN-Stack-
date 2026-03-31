import Like from "../models/likes.model.js";

export const toggleLike = async(req,res)=>{
    try{
        const userId=req.user._id;
        const {foodId} =req.body;

        const existingLike=await Like.findOne({
            user:userId,
            food:foodId
        });

        if(existingLike){
            
            await Like.deleteOne({_id:existingLike._id});

            return res.json({
                success:true,
                message:"Unliked"
            });
        }

        await Like.create({
            user:userId,
            food:foodId
        });
        
        res.json({
            success:true,
            message:"Liked"
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Error toggling like"
        });
    }
    
};