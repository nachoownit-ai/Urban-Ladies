import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { initializeDatabase } from './db.js';
import { authRouter } from './routes/auth.js';
import { dashboardRouter } from './routes/dashboard.js';
import appointmentRoutes from './routes/appointments.js';
import appointmentsN8nRoutes from './routes/appointmentsN8n.js';
import { errorHandler } from './middleware/auth.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/n8n', appointmentsN8nRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Start server
async function start() {
  try {
    await initializeDatabase();
    setTimeout(() => {
      app.listen(env.PORT, () => {
        console.log(`✓ Server running on http://localhost:${env.PORT}`);
        console.log(`✓ Environment: ${env.NODE_ENV}`);
        console.log(`✓ N8N Endpoints available at /api/n8n/`);
      });
    }, 100);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
