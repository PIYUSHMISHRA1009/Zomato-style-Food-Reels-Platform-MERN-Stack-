import { getFeedService } from "../services/feed.service.js";

export const getUserFeed = async (req, res) => {
  try {
    console.log("🔥 NEW FEED CONTROLLER HIT");

    const userId = req.user._id;

    const feed = await getFeedService(userId);

    res.json({
      success: true,
      foodItems: feed
    });

  } catch (error) {
    console.error("Feed Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load feed"
    });
  }
};