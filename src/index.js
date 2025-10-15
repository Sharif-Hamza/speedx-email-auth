require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Import routes
const signupRoute = require('./routes/signup');
const confirmRoute = require('./routes/confirm');
const resendRoute = require('./routes/resend');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline styles in HTML responses
}));

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (for Railway, Heroku, etc.)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX) || 5, // 5 requests per minute
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to signup and resend routes
app.use('/api/signup', limiter);
app.use('/api/resend', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'speedx-email-auth',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'SpeedX Email Authentication Service',
    version: '1.0.0',
    endpoints: {
      signup: 'POST /api/signup',
      confirm: 'GET /api/confirm?token=xxxxx',
      resend: 'POST /api/resend',
      health: 'GET /health'
    }
  });
});

// API routes
app.use('/api/signup', signupRoute);
app.use('/api/confirm', confirmRoute);
app.use('/api/resend', resendRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS error: Origin not allowed' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('==========================================');
  console.log('🚀 SpeedX Email Auth Service');
  console.log('==========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📧 SES configured: ${process.env.SES_SOURCE_EMAIL}`);
  console.log(`🔗 API Base URL: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('==========================================');
  console.log('Available endpoints:');
  console.log(`  POST ${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api/signup`);
  console.log(`  GET  ${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api/confirm?token=xxx`);
  console.log(`  POST ${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api/resend`);
  console.log(`  GET  ${process.env.API_BASE_URL || `http://localhost:${PORT}`}/health`);
  console.log('==========================================');
});

module.exports = app;
