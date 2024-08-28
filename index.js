const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const purchaseRoutes = require('./routes/purchases');
const feedbackRoutes = require('./routes/feedback');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI || "mongodb+srv://vivek1si19cs137:Atlast#2323@cluster0.21t5l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/feedback', feedbackRoutes);

// Serve frontend
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/add-customer', (req, res) => res.sendFile(path.join(__dirname, 'public', 'add-customer.html')));
app.get('/view-customers', (req, res) => res.sendFile(path.join(__dirname, 'public', 'view-customers.html')));
app.get('/purchase-history', (req, res) => res.sendFile(path.join(__dirname, 'public', 'purchase-history.html')));
app.get('/add-purchase', (req, res) => res.sendFile(path.join(__dirname, 'public', 'add-purchase.html')));
app.get('/feedback', (req, res) => res.sendFile(path.join(__dirname, 'public', 'feedback.html')));
app.get('/view-feedback', (req, res) => res.sendFile(path.join(__dirname, 'public', 'view-feedback.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
