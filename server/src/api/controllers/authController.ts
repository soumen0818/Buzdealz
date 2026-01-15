import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  isSubscriber: z.boolean().optional().default(false),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password, isSubscriber } = registerSchema.parse(req.body);

      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          name,
          password: hashedPassword,
          isSubscriber: isSubscriber || false,
        })
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
          isSubscriber: users.isSubscriber,
          createdAt: users.createdAt,
        });

      // Generate JWT token
      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          isSubscriber: newUser.isSubscriber,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: newUser,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Find user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          isSubscriber: user.isSubscriber,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isSubscriber: user.isSubscriber,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      next(error);
    }
  }

  async me(req: Request & { user?: any }, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          isSubscriber: users.isSubscriber,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}
