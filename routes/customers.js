const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
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

// Add customer
router.post('/add', authenticateToken, async(req, res) => {
    const { name, email, phone, preference } = req.body;

    try {
        const customer = new Customer({ name, email, phone, preference, userId: req.user.id });
        await customer.save();
        res.status(201).json({ message: 'Customer added successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to add customer' });
    }
});

// List customers
router.get('/list', authenticateToken, async(req, res) => {
    try {
        const customers = await Customer.find({ userId: req.user.id });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve customers' });
    }
});

// Delete customer
router.delete('/delete/:id', authenticateToken, async(req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete customer' });
    }
});

// Update customer
router.put('/update/:id', authenticateToken, async(req, res) => {
    const { name, email, phone, preference } = req.body;

    try {
        const customer = await Customer.findById(req.params.id);
        if (customer.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this customer' });
        }

        customer.name = name;
        customer.email = email;
        customer.phone = phone;
        customer.preference = preference;

        await customer.save();
        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update customer' });
    }
});

module.exports = router;