const express = require('express');
const { checkout, getPurchases } = require('../controllers/purchaseController');
const { authMiddleware } = require('../Middleware/authmiddleware');

const router = express.Router();

router.post('/checkout', authMiddleware, checkout);
router.get('/', authMiddleware, getPurchases);

module.exports = router;
