const prisma = require('../prisma/client/prismaClient');


const checkout = async (req, res) => {
  try {
    const userId = req.userId;

    const cartItems = await prisma.cart.findMany({ where: { userId } });
    if (cartItems.length === 0) return res.json({ message: "Cart is empty" });

    const purchases = await prisma.$transaction(
      cartItems.map(item =>
        prisma.purchase.create({ data: { userId, productId: item.productId } })
      )
    );

    await prisma.cart.deleteMany({ where: { userId } });

    res.json({ message: "Checkout successful", purchases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPurchases = async (req, res) => {
  try {
    const userId = req.userId;
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: { product: { include: { images: true } } }
    });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { checkout, getPurchases };
