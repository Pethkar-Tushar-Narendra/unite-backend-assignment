import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
// Extend Express Request interface to include user
export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    jwt.verify(
      token as string,
      process.env.JWT_SECRET || 'secret',
      (err, user) => {
        if (err) {
          return res.sendStatus(403); // Forbidden (Invalid token)
        }

        req.user = user as { id: number; role: string };
        next();
      },
    );
  } else {
    res.sendStatus(401); // Unauthorized
  }
};
