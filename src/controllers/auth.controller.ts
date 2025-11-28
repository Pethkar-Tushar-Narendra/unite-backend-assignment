import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

// Helper: Generate Tokens
const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '15m' }, // Short-lived
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: '7d' }, // Long-lived
  );
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Registering user:', { name, email, role }); // Log input

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    console.log('User created:', user.id); // Log success

    res
      .status(201)
      .json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    // CRITICAL: Log the full error to see what went wrong
    console.error('❌ Registration Error:', error);
    res
      .status(500)
      .json({ message: 'Error registering user', error: String(error) });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  // Normally, you'd store and validate refresh tokens in a database
  // to ensure they haven't been revoked. For this assignment, we'll keep it simple.

  jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    async (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      try {
        const foundUser = await User.findByPk(user.id);
        if (!foundUser) {
          return res.sendStatus(403);
        }

        // Generate a new access token ONLY
        const accessToken = jwt.sign(
          { id: foundUser.id, role: foundUser.role },
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '15m' },
        );

        res.json({ accessToken });
      } catch (error) {
        res.sendStatus(500);
      }
    },
  );
};
