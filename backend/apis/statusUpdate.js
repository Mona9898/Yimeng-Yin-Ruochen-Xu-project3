const express = require('express');
const StatusUpdate = require('../db/statusUpdate/statusUpdate.model');
const authenticateToken = require('./authenticateToken'); // Make sure to implement this
const router = express.Router();

// Get all status updates
router.get('/', async (req, res) => {
    try {
        console.log("get all status updates");
        const updates = await StatusUpdate.find().sort({ timestamp: -1 }).populate('user', 'username');
        res.send(updates);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get all status updates for a user
router.get('/:userId', async (req, res) => {
    try {
        const updates = await StatusUpdate.find({ user: req.params.userId }).sort({ timestamp: -1 });
        res.send(updates);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Create a status update
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const newUpdate = new StatusUpdate({
            user: req.user._id, // Ensure the user is taken from the token
            content
        });
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
