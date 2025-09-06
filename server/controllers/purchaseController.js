const prisma = require('../prisma/client/prismaClient');
const sendEmailToQueue = require('../utils/sendEmailToQueue'); // adjust path

const checkout = async (req, res) => {
  try {
    const userId = req.userId;

    // Get cart items with product info
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: { include: { images: true, owner: true } } }
    });

    if (cartItems.length === 0) return res.json({ message: "Cart is empty" });

    // Create purchases in a transaction
    const purchases = await prisma.$transaction(
      cartItems.map(item =>
        prisma.purchase.create({ data: { userId, productId: item.productId, quantity: item.quantity } })
      )
    );

    // Clear the cart
    await prisma.cart.deleteMany({ where: { userId } });

    // Prepare email data
    const buyer = await prisma.user.findUnique({ where: { id: userId } });

    const itemsForEmail = cartItems.map(item => ({
      name: item.product.title,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.images[0]?.url || ''
    }));

    const totalPrice = itemsForEmail.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Send to email queue
    const emailData = {
      buyerEmail: buyer.email,
      buyerName: buyer.name,
      ownerEmail: cartItems[0].product.owner.email, // assume same owner for simplicity
      ownerName: cartItems[0].product.owner.name,
      items: itemsForEmail,
      totalPrice
    };

    await sendEmailToQueue(emailData);

    res.json({ message: "Checkout successful", purchases });
  } catch (err) {
    console.error(err);
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
