const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { authMiddleware } = require('../utils/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
