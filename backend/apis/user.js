const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/user/user.model');

const router = express.Router();

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ message: "Username is already taken" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        
        const token = generateToken(newUser._id);
        res.status(201).send({ token, message: "User registered successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Token verification middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// User can update their own profile
router.put('/:userId', authenticateToken, async (req, res) => {
    // Ensure the logged-in user matches the userId parameter
    if (req.user._id !== req.params.userId) {
        return res.status(403).send({ message: "You can only update your own profile" });
    }

    try {
        const { username, password } = req.body;
        const updatedData = { username };
        
        // If password change is requested, hash the new password
        if (password) {
            updatedData.password = await bcrypt.hash(password, 8);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.userId, updatedData, { new: true });
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send(error);
    }
});

// User can delete their account
router.delete('/:userId', authenticateToken, async (req, res) => {
    if (req.user._id !== req.params.userId) {
        return res.status(403).send({ message: "You can only delete your own account" });
    }

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
