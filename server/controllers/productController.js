const prisma = require('../prisma/client/prismaClient');
const redis = require('../Redis/redis');

const CACHE_TTL = 60; // cache expiry in seconds (1 min for demo)

// Helper for safe Redis set
const setCache = async (key, data, ttl = CACHE_TTL) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.error("Redis set error:", err.message);
  }
};

// Helper for safe Redis get
const getCache = async (key) => {
  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error("Redis get error:", err.message);
    return null;
  }
};

const createProduct = async (req, res) => {
  try {
    let { title, description, price, categoryId, category, images, attributes, quantity } = req.body;
    const userId = req.userId;

    quantity = quantity || 10;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId,
        category,
        owner: { connect: { id: userId } },
        images: { create: images.map(img => ({ url: img.url })) }
      },
      include: { images: true, attributes: true }
    });

    // Invalidate cache
    redis.del("all_products");
    redis.del(`products_category_${categoryId}`);

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { search, categoryId } = req.query;
    const cacheKey = `products_search_${search || "all"}_cat_${categoryId || "all"}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const products = await prisma.product.findMany({
      where: {
        AND: [
          search ? { title: { contains: search, mode: "insensitive" } } : {},
          categoryId ? { categoryId: parseInt(categoryId) } : {}
        ]
      },
      include: { images: true, attributes: true, category: true }
    });

    await setCache(cacheKey, products);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const cacheKey = "all_products";
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const products = await prisma.product.findMany({
      include: { images: true, attributes: true }
    });

    await setCache(cacheKey, products);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRelatedProductsByCategoryName = async (req, res) => {
  const { categoryId, productId } = req.body;

  if (!categoryId || !productId) {
    return res.status(400).json({ error: 'categoryId and productId are required' });
  }

  try {
    const cacheKey = `related_products_cat_${categoryId}_exclude_${productId}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const products = await prisma.product.findMany({
      where: { categoryId: categoryId },
      include: { images: true },
      take: 4,
    });

    await setCache(cacheKey, products);
    res.json(products);
  } catch (err) {
    console.error('Error fetching related products:', err);
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cacheKey = `product_${id}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, attributes: true }
    });

    await setCache(cacheKey, product);
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

    // Invalidate cache
    redis.del(`product_${productId}`);
    redis.del("all_products");

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    await prisma.product.delete({ where: { id: productId } });

    // Invalidate cache
    redis.del(`product_${productId}`);
    redis.del("all_products");

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  getAllProducts, 
  getRelatedProductsByCategoryName 
};
