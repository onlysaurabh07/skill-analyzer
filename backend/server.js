const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
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

// Connect to MongoDB (try Atlas first, fall back to in-memory)
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Atlas connected successfully');
  } catch (err) {
    console.log('⚠️  MongoDB Atlas connection failed, using in-memory database for development');
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ In-memory MongoDB connected successfully');
    } catch (inMemErr) {
      console.error('❌ Failed to connect to any database:', inMemErr.message);
    }
  }
}

connectDB();
