const express = require('express');
const router = express.Router();
const { addUser } = require('../controllers/usercontroller');

router.post('/add', addUser);

module.exports = router;
