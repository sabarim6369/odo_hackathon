const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const { authMiddleware } = require('../Middleware/authmiddleware');

const router = express.Router();

router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.delete('/:id', authMiddleware, removeFromCart);

module.exports = router;
