const express = require("express");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");
const { authenticateToken } = require("../Middleware/authmiddleware");

const router = express.Router();

router.post("/add", authenticateToken, addToWishlist);
router.get("/", authenticateToken, getWishlist);
router.delete("/remove/:productId", authenticateToken, removeFromWishlist);
router.delete("/clear", authenticateToken, clearWishlist);

module.exports = router;
