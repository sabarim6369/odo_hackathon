const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserStats,
} = require("../controllers/userController");
const { authenticateToken } = require("../Middleware/authmiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);
router.put("/change-password", authenticateToken, changePassword);
router.get("/stats", authenticateToken, getUserStats);

module.exports = router;
