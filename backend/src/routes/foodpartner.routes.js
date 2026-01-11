const express = require('express');
const foodPartnerController = require('../controllers/foodpartner.controller');
const authMiddleware = require('../middlewares/auth.middleware');

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

module.exports = router;
