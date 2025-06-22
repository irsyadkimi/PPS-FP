const express = require('express');
const cors = require('cors');
const path = require('path'); // Add this import
// const helmet = require('helmet'); // Comment jika belum install
// const compression = require('compression'); // Comment jika belum install  
// const morgan = require('morgan'); // Comment jika belum install
// const rateLimit = require('express-rate-limit'); // Comment jika belum install
require('dotenv').config();

// Import routes
const assessmentRoutes = require('./routes/assessmentRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const userRoutes = require('./routes/userRoutes');

// Import database connection (comment jika belum ada)
const connectDB = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
try {
  connectDB();
} catch (error) {
  console.log('⚠️  Database connection error:', error.message);
}

// Security middleware (uncomment when helmet installed)
// app.use(helmet());

// Rate limiting (uncomment when express-rate-limit installed)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
// });
// app.use('/api/', limiter);

// CORS configuration - UPDATED untuk support public IP
const allowedOrigins = [
  'http://localhost:3000',           // Development
  'http://127.0.0.1:3000',          // Local development alternative
  'http://217.15.160.69:3000',      // Production frontend
  'http://217.15.160.69',           // Production without port
  process.env.CORS_ORIGIN || 'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Handle preflight requests
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware (uncomment when compression installed)
// app.use(compression());

// Logging middleware (uncomment when morgan installed)
// app.use(morgan('combined'));

// Static files
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Diet Assessment API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    cors: {
      allowedOrigins: allowedOrigins,
      requestOrigin: req.get('Origin') || 'no-origin'
    }
  });
});

// API Documentation
app.get('/api', (req, res) => {
  res.json({
    name: 'Diet Assessment API',
    version: '1.0.0',
    description: 'API untuk asesmen diet dan rekomendasi makanan sehat',
    server: {
      host: req.get('Host'),
      origin: req.get('Origin'),
      userAgent: req.get('User-Agent')
    },
    endpoints: {
      health: 'GET /health',
      assessment: {
        form: 'GET /api/v1/assessment/form',
        submit: 'POST /api/v1/assessment',
        validate: 'POST /api/v1/assessment/validate',
        history: 'GET /api/v1/assessment/history/:userId',
        getById: 'GET /api/v1/assessment/:assessmentId',
        update: 'PUT /api/v1/assessment/:assessmentId',
        delete: 'DELETE /api/v1/assessment/:assessmentId'
      },
      recommendation: {
        get: 'GET /api/v1/recommendation',
        getById: 'GET /api/v1/recommendation/:mealId',
        filter: 'POST /api/v1/recommendation/filter',
        user: 'GET /api/v1/recommendation/:userId'
      },
      user: {
        profile: 'GET /api/v1/user/profile',
        updateProfile: 'PUT /api/v1/user/profile',
        preferences: 'GET /api/v1/user/preferences',
        updatePreferences: 'PUT /api/v1/user/preferences',
        dashboard: 'GET /api/v1/user/dashboard'
      }
    }
  });
});

// API routes
app.use('/api/v1/assessment', assessmentRoutes);
app.use('/api/v1/recommendation', recommendationRoutes);
app.use('/api/v1/user', userRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: '/api',
    requestedPath: req.originalUrl,
    requestOrigin: req.get('Origin')
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Special handling for CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      origin: req.get('Origin'),
      allowedOrigins: allowedOrigins
    });
  }
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Diet Assessment API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Public health check: http://217.15.160.69:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`🥗 Assessment API: http://localhost:${PORT}/api/v1/assessment`);
  console.log(`🍽️  Recommendation API: http://localhost:${PORT}/api/v1/recommendation`);
  console.log(`👤 User API: http://localhost:${PORT}/api/v1/user`);
  console.log(`🔒 CORS allowed origins:`, allowedOrigins);
});

module.exports = app;