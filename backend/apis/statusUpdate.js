const express = require('express');
const StatusUpdate = require('../db/statusUpdate/statusUpdate.model');
const authenticateToken = require('./authenticateToken'); // Make sure to implement this
const router = express.Router();
const User = require('../db/user/user.model'); // Import your User model

// Get all status updates
router.get('/', async (req, res) => {
    console.log("there");
    try {
        console.log("get all status updates");
        const updates = await StatusUpdate.find().sort({ timestamp: -1 }).populate('user', 'username');
        res.send(updates);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get all status updates for the logged-in user
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const updates = await StatusUpdate.find({ user: req.user._id }).sort({ createdAt: -1 });
        console.log(req.user._id); // why it is undefined?
        console.log(updates);
        res.send(updates);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Create a status update
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Retrieve content from the request body
        const { content } = req.body;
        // Retrieve username from the request body
        const { username } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const newUpdate = new StatusUpdate({
            content,
            user: user._id
        });
        console.log(newUpdate);
        await newUpdate.save();
        res.status(201).send(newUpdate);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a status update
router.put('/:updateId', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const update = await StatusUpdate.findOneAndUpdate(
            { _id: req.params.updateId, user: req.user._id }, // Ensure the update belongs to the user
            { content },
            { new: true }
        );
        if (!update) {
            return res.status(404).send({ message: "Status update not found or user not authorized to modify it" });
        }
        res.send(update);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a status update
router.delete('/:updateId', authenticateToken, async (req, res) => {
    try {
        const deletedUpdate = await StatusUpdate.findOneAndDelete({
            _id: req.params.updateId,
            user: req.user._id // Ensure the update belongs to the user
        });
        if (!deletedUpdate) {
            return res.status(404).send({ message: "Status update not found or user not authorized to delete it" });
        }
        res.send({ message: "Status update deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
