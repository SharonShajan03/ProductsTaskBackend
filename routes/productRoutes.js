const express = require('express');
const Product = require('../models/product');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Create Product
router.post('/', protect, admin, async (req, res) => {
  const { name, description, price, stock } = req.body;
  const product = new Product({ name, description, price, stock });
  try {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Products
router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Update Product
router.put('/:id', protect, admin, async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Product
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;