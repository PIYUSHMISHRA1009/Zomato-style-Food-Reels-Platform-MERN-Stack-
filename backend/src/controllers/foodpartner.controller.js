import foodModel from '../models/food.model.js';
import foodPartnerModel from '../models/foodpartner.model.js';

function formatPartner(partnerDoc){
    if(!partnerDoc) return null;
    return {
        _id: partnerDoc._id,
        name: partnerDoc.name,
        address: partnerDoc.address,
        contactName: partnerDoc.contactName,
        phone: partnerDoc.phone,
        email: partnerDoc.email
    };
}

async function getMyStore(req,res){
    try{
        if(!req.foodPartner){
            return res.status(401).json({
                message:"Please Login first"
            });
        }

        const foodItems = await foodModel
            .find({ foodPartner: req.foodPartner._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message:"Food items fetched successfully",
            foodPartner: formatPartner(req.foodPartner),
            foodItems
        });
    }catch(err){
        res.status(500).json({
            message:"Failed to fetch food items"
        });
    }
}

async function getPartnerStore(req,res){
    try{
        const { partnerId } = req.params;
        const partner = await foodPartnerModel
            .findById(partnerId)
            .select("_id name address contactName phone email");

        if(!partner){
            return res.status(404).json({
                message:"Food partner not found"
            });
        }

        const foodItems = await foodModel
            .find({ foodPartner: partnerId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message:"Food items fetched successfully",
            foodPartner: formatPartner(partner),
            foodItems
        });
    }catch(err){
        res.status(500).json({
            message:"Failed to fetch food items"
        });
    }
}

export default {
    getMyStore,
    getPartnerStore
};
