import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import Home from "../pages/general/Home";
import Saved from "../pages/general/Saved";
import CreateFood from "../pages/food-partner/CreateFood";
import Profile from "../pages/food-partner/Profile";
import like from "../models/likes.model.js";
import Save from "../models/save.model.js";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/user/register"
          element={<UserRegister />}
        />
        <Route
          path="/user/login"
          element={<UserLogin />}
        />
        <Route
          path="/food-partner/register"
          element={<FoodPartnerRegister />}
        />
        <Route
          path="/food-partner/login"
          element={<FoodPartnerLogin />}
        />
        <Route path="/" element={<Home />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/food-partner/profile" element={<Profile />} />
        <Route path="/food-partner/:id" element={<Profile />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </Router>
  );
};

const getEngagementData = async(foodId,userId)=>{
  const[likesCount,savesCount,isLiked,isSaved]=await Promise.all([
    Like.countDocuments({foodId}),
    Save.countDocuments({foodId}),
    Like.exists({foodId,userId}),
    Save.exists({foodId,userId})
  ]);

  return{
    likesCount,
    savesCount,
    isLiked:!!isLiked,
    isSaved:!!isSaved
  };
};

export default AppRoutes;
