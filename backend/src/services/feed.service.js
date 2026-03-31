import Food from "../models/food.model.js";
import Like from "../models/likes.model.js";
import Save from "../models/save.model.js";

const getEngagementData = async (foodId, userId) => {
  try {
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
  } catch (error) {
    console.error("Engagement aggregation error:", error);
    return {
      likesCount: 0,
      savesCount: 0,
      isLiked: false,
      isSaved: false
    };
  }
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

        const score = (engagement.likesCount * 2) + (engagement.savesCount * 3);

        console.log("Processed food:", foodObj);
        return {
        ...foodObj,
        ...engagement,
        score
        };
    })
  );
   enrichedFeed.sort((a,b)=> b.score-a.score);
  return enrichedFeed;
};