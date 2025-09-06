const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getAllProducts} = require('../controllers/productController');
const { authMiddleware } = require('../Middleware/authmiddleware');

const router = express.Router();

router.post('/', authMiddleware, createProduct);
router.get('/allproducts', authMiddleware,getAllProducts); 

router.get('/', getProducts);

router.get('/prod/:id', getProductById);
router.put('/prod/:id', authMiddleware, updateProduct);
router.delete('/prod/:id', authMiddleware, deleteProduct);


module.exports = router;
