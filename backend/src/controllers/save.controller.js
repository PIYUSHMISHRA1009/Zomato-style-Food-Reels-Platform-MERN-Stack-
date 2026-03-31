import Save from "../models/save.model.js";

console.log("🔥 SAVE API HIT");

export const toggleSave = async (req, res) => {
  try {
    console.log("🔥 SAVE API HIT");

    const userId = req.user._id;
    const { foodId } = req.body || {};

    console.log("userId:", userId);
    console.log("foodId:", foodId);

    const existingSave = await Save.findOne({
      user: userId,
      food: foodId
    });

    console.log("existingSave:", existingSave);

    if (existingSave) {
      await Save.deleteOne({ _id: existingSave._id });

      console.log("UNSAVED");

      return res.json({
        success: true,
        message: "Unsaved"
      });
    }

    console.log("CREATING SAVE...");

    await Save.create({
      user: userId,
      food: foodId
    });

    console.log("SAVED");

    res.json({
      success: true,
      message: "Saved"
    });

  } catch (error) {
    console.error("SAVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling save"
    });
  }
};