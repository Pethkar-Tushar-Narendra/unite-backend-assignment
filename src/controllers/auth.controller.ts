import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '15m' },
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: '7d' },
  );
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Registering user:', { name, email, role });
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, role });
    console.log('User created:', user.id);
    res
      .status(201)
      .json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error('Registration Error:', error);
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
  if (!token) return res.sendStatus(401);
  jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    async (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      try {
        const foundUser = await User.findByPk(user.id);
        if (!foundUser) return res.sendStatus(403);
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
