import express from 'express';
import foodPartnerController from '../controllers/foodpartner.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/food-partner/me - protected, returns own profile and foods
router.get(
    '/me',
    authMiddleware.authFoodPartnerMiddleware,
    foodPartnerController.getMyStore
);

// GET /api/food-partner/:partnerId - public, returns partner profile and foods
router.get(
    '/:partnerId',
    foodPartnerController.getPartnerStore
);

export default router;
