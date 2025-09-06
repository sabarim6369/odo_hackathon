const prisma =require('../prisma/client/prismaClient');


const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    const cartItem = await prisma.cart.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity || 1 } },
      create: { userId, productId, quantity: quantity || 1 }
    });

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await prisma.cart.findMany({
      where: { userId },
      include: { product: { include: { images: true } } }
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await prisma.cart.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addToCart, getCart, removeFromCart };
