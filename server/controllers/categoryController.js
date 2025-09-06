const prisma = require('../prisma/client/prismaClient');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name }
    });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
