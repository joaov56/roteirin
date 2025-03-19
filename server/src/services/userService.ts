import { User } from '../models/User';
import bcrypt from 'bcrypt';

export class UserService {
  async register(name: string, email: string, password: string) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();
    
    return {
      id: user._id,
      name: user.name,
      email: user.email
    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email
    };
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
} 