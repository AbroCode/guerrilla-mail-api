import express from 'express';
import cors from 'cors';
import accountsRouter from './routes/accounts';
import authRouter from './routes/auth';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1', accountsRouter);
app.use('/api/v1', authRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API documentation endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    name: 'Guerrilla Mail API',
    version: '1.0.0',
    description: 'Temporary email service API',
    endpoints: {
      accounts: {
        create: 'POST /api/v1/accounts',
        get: 'GET /api/v1/accounts/{id}',
        listEmails: 'GET /api/v1/accounts/{id}/emails',
        getEmail: 'GET /api/v1/accounts/{id}/emails/{emailId}',
        deleteEmail: 'DELETE /api/v1/accounts/{id}/emails/{emailId}',
        delete: 'DELETE /api/v1/accounts/{id}',
      },
      auth: {
        generateKey: 'POST /api/v1/auth/keys',
        verify: 'POST /api/v1/auth/verify',
      },
    },
    documentation: 'https://guerrillamail.com/documentation',
    authentication: 'Bearer YOUR_API_KEY',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} not found`,
    available_endpoints: 'GET /api/v1',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

export default app;
