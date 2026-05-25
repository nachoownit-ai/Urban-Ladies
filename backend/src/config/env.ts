import dotenv from 'dotenv';

dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/urban_ladies_db',
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
