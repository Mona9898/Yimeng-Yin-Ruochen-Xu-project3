const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/user/user.model');
const router = express.Router();

// Helper function to generate JWT
const generateToken = (userId) => {

    const payload = {
        userId: userId
      };
      
    const secret = 'your_secret_key';
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });
    return token;
};


router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            console.log(existingUser);
            return res.status(400).send({ message: "Username is already taken" });
        }
    
        const newUser = new User({ username, password})

        await newUser.save();
        
        res.status(201).send({ 
            username: newUser.username, 
            message: "User registered successfully",
            registeredAt: newUser.createdTime
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send({ message: "Invalid credentials" });
        }
        if (password !== user.password) {
            return res.status(401).send({ message: "Invalid credentials" });
        }
        const token = generateToken(user._id);
        res.status(200).send({ token, username });


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
