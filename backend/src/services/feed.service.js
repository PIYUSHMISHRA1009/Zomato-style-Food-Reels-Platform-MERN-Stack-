import Food from "../models/food.model.js";
import Like from "../models/likes.model.js";
import Save from "../models/save.model.js";

const getEngagementData = async (foodId, userId) => {
  const [likesCount, savesCount, isLiked, isSaved] = await Promise.all([
    Like.countDocuments({ food: foodId }),
    Save.countDocuments({ food: foodId }),
    Like.exists({ food: foodId, user: userId }),
    Save.exists({ food: foodId, user: userId })
  ]);

  return {
    likesCount,
    savesCount,
    isLiked: !!isLiked,
    isSaved: !!isSaved
  };
};

export const getFeedService = async (userId) => {
  const foods = await Food.find({
  foodPartner: { $ne: userId }
}).sort({ createdAt: -1 });

  const enrichedFeed = await Promise.all(
    foods.map(async (food) => {
      const engagement = await getEngagementData(food._id, userId);

      const foodObj = food.toObject();

        delete foodObj.likeCount;
        delete foodObj.savesCount;
        console.log("Processed food:", foodObj);
        return {
        ...foodObj,
        ...engagement
        };
    })
  );

  return enrichedFeed;
};