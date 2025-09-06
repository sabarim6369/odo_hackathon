const prisma = require('../prisma/client/prismaClient');
const sendEmailToQueue = require('../Services/EmailService');

const checkout = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    let cartItems;

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: true, owner: true }
      });
      if (!product) return res.status(404).json({ message: "Product not found" });

      cartItems = [{ product, productId: product.id, quantity: 1 }];
    } else {
      cartItems = await prisma.cart.findMany({
        where: { userId },
        include: { product: { include: { images: true, owner: true } } }
      });
      if (cartItems.length === 0) return res.json({ message: "Cart is empty" });
    }

    const purchases = await prisma.$transaction(
      cartItems.map(item =>
        prisma.purchase.create({ data: { userId, productId: item.productId } })
      )
    );

    if (!productId) await prisma.cart.deleteMany({ where: { userId } });

    const buyer = await prisma.user.findUnique({ where: { id: userId } });

    const itemsForEmail = cartItems.map(item => ({
      name: item.product.title,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.images[0]?.url || ''
    }));

    const totalPrice = itemsForEmail.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const emailData = {
      type: "purchase", // add a type to distinguish email templates
      buyerEmail: buyer.email,
      buyerName: buyer.name,
      ownerEmail: cartItems[0].product.owner.email,
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

// Cancel purchase
const cancelPurchase = async (req, res) => {
  try {
    const userId = req.userId;
    const { purchaseId } = req.body;

    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: { product: { include: { owner: true, images: true } }, user: true }
    });

    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    if (purchase.userId !== userId) return res.status(403).json({ message: "Unauthorized" });

    await prisma.purchase.delete({ where: { id: purchaseId } });

    // Send cancel email
    const emailData = {
      type: "cancel",
      buyerEmail: purchase.user.email,
      buyerName: purchase.user.name,
      ownerEmail: purchase.product.owner.email,
      ownerName: purchase.product.owner.name,
      items: [{
        name: purchase.product.title,
        quantity: 1,
        price: purchase.product.price,
        image: purchase.product.images[0]?.url || ''
      }],
      totalPrice: purchase.product.price
    };

    await sendEmailToQueue(emailData);

    res.json({ message: "Purchase canceled successfully" });
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

module.exports = { checkout, getPurchases, cancelPurchase };
