const express = require('express');
const { checkout, getPurchases,cancelPurchase} = require('../controllers/purchaseController');
const { authMiddleware } = require('../Middleware/authmiddleware');

const router = express.Router();

router.post('/checkout', authMiddleware, checkout);
router.get('/', authMiddleware, getPurchases);
router.post('/cancel', authMiddleware, cancelPurchase);


module.exports = router;
