import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthPayload } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
}
