const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start server immediately (don't wait for DB)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT} (Network Accessible)`));

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
    console.log('🔍 Current MONGO_URI starts with:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'undefined');
    console.error('');
    console.error('🔧 Troubleshooting Steps:');
    console.error('   1. Ensure 0.0.0.0/0 is ACTIVE in MongoDB Atlas -> Network Access.');
    console.error('   2. Verify the username and password in your Render Environment Variables.');
    console.error('   3. If using special characters in your password, ensure they are URL-encoded.');
  });
