const prisma = require('../prisma/client/prismaClient');
const redis=require('../Redis/redis');

const createProduct = async (req, res) => {
  try {
let { title, description, price, categoryId,category, images, attributes, quantity } = req.body;
    const userId = req.userId;
   
//   categoryId=1
    quantity=10;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId,
        category,
       owner: { connect: { id: userId } },
        images: { create: images.map(img => ({ url: img.url })) },
        // attributes: { create: attributes.map(attr => ({ key: attr.key, value: attr.value })) }
      },
      include: { images: true, attributes: true }
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { search, categoryId } = req.query;
    const products = await prisma.product.findMany({
      where: {
        AND: [
          search ? { title: { contains: search, mode: "insensitive" } } : {},
          categoryId ? { categoryId: parseInt(categoryId) } : {}
        ]
      },
      include: { images: true, attributes: true, category: true }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, attributes: true }
    });
    console.log(products)
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getRelatedProductsByCategoryName = async (req, res) => {
  const { categoryId, productId } = req.body; // get data from request body

  if (!categoryId || !productId) {
    return res.status(400).json({ error: 'categoryName and productId are required' });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId,          // match by category name
        // id: { not: Number(productId) },  // exclude current product
      },
      include: {
        images: true,
        // attributes: true,
      },
      take: 4, // optional: limit for UI
    });

    res.json(products);
  } catch (err) {
    console.error('Error fetching related products by name:', err);
    res.status(500).json({ error: err.message });
  }
};



const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { images: true, attributes: true}
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
const { title, description, price, categoryId, images, attributes, quantity } = req.body;
    const productId = parseInt(req.params.id);

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId,
        images: { deleteMany: {}, create: images.map(img => ({ url: img.url })) },
        attributes: { deleteMany: {}, create: attributes.map(attr => ({ key: attr.key, value: attr.value })) }
      },
      include: { images: true, attributes: true }
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getAllProducts,getRelatedProductsByCategoryName };
