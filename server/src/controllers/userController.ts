import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface AuthenticatedRequest extends FastifyRequest {
  user: {
    userId: string;
    email: string;
  };
}

export const userController = {
  async register(request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) {
    try {
      const { name, email, password } = request.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return reply.status(400).send({ error: 'Email already registered' });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password
      });

      await user.save();

      // Generate JWT token
      const token = await reply.jwtSign({
        userId: user._id,
        email: user.email
      });

      return reply.status(201).send({
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  },

  async login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Compare password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = await reply.jwtSign({
        userId: user._id,
        email: user.email
      });

      return reply.send({
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  },

  async getProfile(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const userId = request.user.userId;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send({ user });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}; 