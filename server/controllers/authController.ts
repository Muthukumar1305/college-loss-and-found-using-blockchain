import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const generateToken = (id: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    console.log(`[AUTH] User registered: ${user.email} (Role: ${user.role})`);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString(), user.role),
    });
  } catch (error) {
    console.error('[AUTH] Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt for: ${email}`);

    // Ensure default admin exists if the email matches
    if (email === 'admin@campus.edu') {
      let admin = await User.findOne({ email: 'admin@campus.edu' });
      if (!admin) {
        console.log('[AUTH] Seeding default admin account...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        admin = await User.create({
          name: 'System Admin',
          email: 'admin@campus.edu',
          password: hashedPassword,
          role: 'admin'
        });
        console.log('[AUTH] Default admin account seeded successfully');
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[AUTH] Login failed: User not found - ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[AUTH] Login failed: Incorrect password for - ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`[AUTH] Login successful: ${user.email} (Role: ${user.role})`);

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};