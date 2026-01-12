import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();
//user authentication and registration APIs
router.post('/user/register',authController.registerUser)
router.post('/user/login',authController.loginUser)
router.get('/user/logout',authController.logoutUser)

//food partner authentication and registration APIs
router.post('/food-partner/register',authController.registerFoodPartner)
router.post('/food-partner/login',authController.loginFoodPartner)
router.get('/food-partner/logout',authController.logoutFoodPartner)
export default router;