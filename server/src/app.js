const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Mock Products
const MOCK_PRODUCTS = [
  { id: 1, title: 'Premium Wireless Headphones', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', category: 'Electronics' },
  { id: 2, title: 'Minimalist Smartwatch', price: 199.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', category: 'Wearables' },
  { id: 3, title: 'Mechanical Keyboard', price: 149.00, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop', category: 'Computing' },
  { id: 4, title: 'Pro Camera Lens', price: 899.99, image: 'https://images.unsplash.com/photo-1617005082833-255e2cdfb9cf?q=80&w=600&auto=format&fit=crop', category: 'Photography' },
  { id: 5, title: 'Noise-Cancelling Earbuds', price: 159.99, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop', category: 'Audio' },
  { id: 6, title: 'Ergonomic Desk Chair', price: 349.00, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600&auto=format&fit=crop', category: 'Furniture' },
];

app.get('/api/products', (req, res) => {
  // Add a slight delay to simulate network latency for UI testing
  setTimeout(() => {
    res.json(MOCK_PRODUCTS);
  }, 500);
});

// Root Route (optional, just to show something)
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

module.exports = app;
