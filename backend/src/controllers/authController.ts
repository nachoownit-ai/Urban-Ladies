import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import { env } from '../config/env.js';
import { AuthPayload } from '../types/index.js';

function dbRun(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function dbGet(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name, salonId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required',
      });
    }

    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await dbRun(
      'INSERT INTO users (id, email, password_hash, name, salon_id, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, email, passwordHash, name, salonId || null, 'employee']
    );

    const token = (jwt.sign as any)(
      { id: userId, email, name, role: 'employee' },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      data: { token, user: { id: userId, email, name, role: 'employee' } },
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const user = await dbGet(
      'SELECT id, email, password_hash, name, role FROM users WHERE email = ? AND active = 1',
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const token = (jwt.sign as any)(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
}

export async function me(req: Request, res: Response) {
  res.json({
    success: true,
    data: req.user,
  });
}
