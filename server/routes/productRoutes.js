const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getAllProducts,getRelatedProductsByCategoryName} = require('../controllers/productController');
const { authMiddleware } = require('../Middleware/authmiddleware');

const router = express.Router();

router.post('/', authMiddleware, createProduct);
router.get('/allproducts',getAllProducts); 

router.get('/', getProducts);

router.get('/prod/:id', getProductById);
router.put('/prod/:id', authMiddleware, updateProduct);
router.delete('/prod/:id', authMiddleware, deleteProduct);
// To get related products (exclude current product if desired)
// Related products route
router.post('/prod/related', getRelatedProductsByCategoryName);



module.exports = router;
