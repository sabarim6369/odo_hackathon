const prisma = require("../prisma/client/prismaClient");
const bcrypt = require("bcryptjs");

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get user profile error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, profilePic } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(profilePic !== undefined && { profilePic }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Update user profile error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required" });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [productCount, purchaseCount, cartCount, wishlistCount] =
      await Promise.all([
        prisma.product.count({ where: { ownerId: userId } }),
        prisma.purchase.count({ where: { userId } }),
        prisma.cart.count({ where: { userId } }),
        prisma.wishlist.count({ where: { userId } }),
      ]);

    const totalEarnings = await prisma.purchase.aggregate({
      where: {
        product: { ownerId: userId },
      },
      _sum: {
        quantity: true,
      },
    });

    const stats = {
      productsListed: productCount,
      purchasesMade: purchaseCount,
      cartItems: cartCount,
      wishlistItems: wishlistCount,
      totalSales: totalEarnings._sum.quantity || 0,
    };

    res.json(stats);
  } catch (err) {
    console.error("Get user stats error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserStats,
};
