const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware to verify JWT
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

// Add feedback
router.post('/add', authenticateToken, async(req, res) => {
    const { customerId, feedback } = req.body;

    try {
        const newFeedback = new Feedback({ customerId, userId: req.user.id, feedback });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to submit feedback', details: error.message });
    }
});

// List feedback
router.get('/list', authenticateToken, async(req, res) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.user.id }).populate('customerId', 'name');
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve feedback' });
    }
});

module.exports = router;