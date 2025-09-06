const prisma = require("../prisma/client/prismaClient");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    // Validate productId
    if (!productId || isNaN(parseInt(productId))) {
      return res.status(400).json({ error: "Valid product ID is required" });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if user is trying to add their own product
    if (product.ownerId === userId) {
      return res
        .status(400)
        .json({ error: "You cannot add your own product to wishlist" });
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId: parseInt(productId) } },
    });

    if (existingItem) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: { userId, productId: parseInt(productId) },
      include: {
        product: {
          include: {
            images: true,
            owner: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    res.status(201).json(wishlistItem);
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).json({ error: err.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: true,
            owner: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    const deletedItem = await prisma.wishlist.delete({
      where: { userId_productId: { userId, productId: parseInt(productId) } },
    });

    res.json({ message: "Removed from wishlist", deletedItem });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Item not found in wishlist" });
    }
    res.status(500).json({ error: err.message });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await prisma.wishlist.deleteMany({
      where: { userId },
    });

    res.json({ message: `Cleared ${result.count} items from wishlist` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
};
