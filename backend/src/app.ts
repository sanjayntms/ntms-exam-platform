import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiter - High capacity for proctored exam halls & multi-candidate lab environments
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000, // Allow 100,000 requests per 15 mins to support 50+ candidates sharing 1 public IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded: Please wait a moment and try again.' },
});
app.use(limiter);

// Root landing endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'NTMS Exam Platform Backend API',
    status: 'ONLINE',
    swagger: '/api-docs',
    health: '/health',
    message: 'Welcome to NTMS Exam Platform REST API server. For the Web Portal UI, access port 3000.',
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', service: 'NTMS Exam Platform API', timestamp: new Date().toISOString() });
});

// Swagger Specification Mock
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'NTMS Examination Platform REST API',
    version: '1.0.0',
    description: 'Enterprise API for NTMS commercial certification exams, case studies, simulations & labs.',
  },
  paths: {},
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api/v1', routes);

// Error Handler
app.use(errorHandler);

export default app;
