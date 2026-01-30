const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
if (!process.env.MONGODB_URI) {
    console.error('\nERROR: MONGODB_URI is not set.\n- In Render: go to your Service → Environment → Add Environment Variable named MONGODB_URI\n- In local dev: set it in backend/.env (or export in your shell)\nMake sure the value is a valid MongoDB connection string (Atlas recommended).\n');
    process.exit(1);
}

const mongooseOptions = {
    // timeouts to fail fast if DB inaccessible
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
};

// Retry connecting to MongoDB with exponential backoff-like behavior
const connectWithRetry = async (retries = 5, delay = 5000) => {
    for (let i = 1; i <= retries; i++) {
        try {
            console.log(`Attempting MongoDB connection (try ${i}/${retries})...`);
            await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
            console.log('Connected to MongoDB');
            // Seed products only after a successful connection
            try {
                await seedProducts();
            } catch (err) {
                console.error('Seeding after connect failed:', err);
            }
            return;
        } catch (err) {
            console.error(`MongoDB connection attempt ${i} failed:`, err.message || err);
            if (i === retries) {
                console.error('All MongoDB connection attempts failed. The app will continue but DB features will be unavailable.');
            } else {
                console.log(`Retrying in ${delay / 1000}s...`);
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }
};

connectWithRetry();


// Models
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [{ productId: Number, quantity: Number }]
});

const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    image: String,
    category: String
});

const Product = mongoose.model('Product', ProductSchema);

// Initial Products Data
const initialProducts = [
    { id: 1, name: 'Summer Floral Dress', price: 1200, image: '/images/p1.png', category: 'Dresses' },
    { id: 2, name: 'Classic Denim Jacket', price: 2500, image: '/images/p2.png', category: 'Outwear' },
    { id: 3, name: 'Minimalist T-Shirt', price: 500, image: '/images/p3.png', category: 'T-Shirts' },
    { id: 4, name: 'Boho Style Skirt', price: 800, image: '/images/p4.png', category: 'Skirts' },
    { id: 5, name: 'Leather Biker Jacket', price: 4500, image: '/images/p5.png', category: 'Outwear' },
    { id: 6, name: 'Evening Silk Gown', price: 3500, image: '/images/p6.png', category: 'Dresses' },
    { id: 7, name: 'Casual Cotton Chinos', price: 1500, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', category: 'Pants' },
    { id: 8, name: 'Knitted Winter Sweater', price: 1800, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500', category: 'Knitwear' }
];

// Seed Products
const seedProducts = async () => {
    if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping product seeding because MongoDB is not connected.');
        return;
    }
    try {
        await Product.deleteMany({}); // Clear existing products to refresh with new images/items
        await Product.insertMany(initialProducts);
        console.log('Products seeded successfully');
    } catch (err) {
        console.error('Error seeding products:', err);
    }
};
// Note: seeding is invoked after a successful DB connection in connectWithRetry()


// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token, email: user.email });
    } catch (err) {
        res.status(400).json({ error: 'Login failed' });
    }
});

app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Health check for root path
app.get('/', (req, res) => res.send('API is running'));

// Serve static frontend in production (optional)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../fashion-surf/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../fashion-surf/dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
