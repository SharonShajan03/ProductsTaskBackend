const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const user = new User({ name, email, password, isAdmin: isAdmin || false });
    try {
        const createdUser  = await user.save();
        res.status(201).json(createdUser );
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, isAdmin: user.isAdmin });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// Get All Users (Admin Only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

module.exports = router;