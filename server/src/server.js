import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { initDatabase } from '../../database/db.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Initialize database schema and initial data
try {
  initDatabase();
  console.log('✅ SQLite Database ready and schema synchronized.');
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: config.clientOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Contact Management API',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/contacts', contactRoutes);

// 404 & error handling
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`🚀 Contact Management API server listening on http://localhost:${config.port}`);
});

export default app;
