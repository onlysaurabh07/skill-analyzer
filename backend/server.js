const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start server immediately (don't wait for DB)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Connect to MongoDB (asynchronously)
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('');
    console.error('🔧 FIX: Your current network is blocking MongoDB Atlas SRV DNS lookups.');
    console.error('   Solutions:');
    console.error('   1. Switch to a different network (mobile hotspot, home WiFi)');
    console.error('   2. Use a VPN');
    console.error('   3. In MongoDB Atlas → Network Access → Add IP: 0.0.0.0/0');
    console.error('   4. Use local MongoDB: change MONGO_URI to mongodb://localhost:27017/skillgap');
  });
