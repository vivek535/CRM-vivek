const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
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

// Add purchase
router.post('/add', authenticateToken, async(req, res) => {
    const { caratType, hallmarkNumber, weight, price } = req.body;

    try {
        const purchase = new Purchase({ caratType, hallmarkNumber, weight, price, userId: req.user.id });
        await purchase.save();
        res.status(201).json({ message: 'Purchase recorded successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to record purchase' });
    }
});

// List purchases
router.get('/list', authenticateToken, async(req, res) => {
    try {
        const purchases = await Purchase.find({ userId: req.user.id });
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve purchases' });
    }
});

module.exports = router;