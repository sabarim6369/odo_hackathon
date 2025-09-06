const express = require('express');
const { createCategory, getCategories } = require('../controllers/categoryController');

const router = express.Router();

router.post('/', createCategory);   // Create new category
router.get('/', getCategories);     // List all categories

module.exports = router;
