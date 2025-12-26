const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const logger = require('./config/logger');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://averzo.com' 
      : 'http://localhost:3000'
  } 
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Security Middleware
const securityMiddleware = require('./middleware/security');
app.use(securityMiddleware);

// Logging Middleware
app.use(morgan('combined', { stream: logger.stream }));

// Connect to MongoDB and Redis
const connectDB = require('./config/db');
const { redis, cacheMiddleware } = require('./config/redis');
connectDB();

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const errorHandler = require('./middleware/error');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error Handler
app.use(errorHandler);

// Basic Route
// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is healthy',
    time: new Date().toISOString()
  });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Averzo Backend is Running!');
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log('User connected');
  
  socket.on('updateStock', (data) => {
    io.emit('stockUpdated', data);
  });
  
  socket.on('orderPlaced', (data) => {
    io.emit('newOrder', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});