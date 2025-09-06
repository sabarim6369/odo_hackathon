const express = require('express');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cors= require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());


app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/categories', categoryRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
