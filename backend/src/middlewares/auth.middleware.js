import foodPartnerModel from '../models/foodpartner.model.js';
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';

async function authFoodPartnerMiddleware(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"Please Login first"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const foodPartner= await foodPartnerModel.findById(decoded.id);
        
        if(!foodPartner){
            return res.status(401).json({
                message:"User not found. Please login again."
            });
        }
        
        req.foodPartner=foodPartner;
        
        next()

    } catch(err){
        return res.status(401).json({
            message:"Invalid Token"
        });
    }
}

async function authUserMiddleware(req,res,next){
    const token=req.cookies.token;
    
    if(!token){
        return res.status(401).json({
            message:"Please Login First"
        })
    }
    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET);

        const user= await userModel.findById(decoded.id);
        
        if(!user){
            return res.status(401).json({
                message:"User not found. Please login again."
            });
        }
        
        req.user=user;

        next();
    } catch(err){
        return res.status(401).json({
            message:"Invalid Token"
        });
    }
}


export default {
    authFoodPartnerMiddleware,
    authUserMiddleware
}

export { authFoodPartnerMiddleware, authUserMiddleware };