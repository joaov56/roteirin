import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { User, createUser, findUserByEmail } from '../models/User';

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const register = async (
  request: FastifyRequest<{ Body: RegisterRequest }>,
  reply: FastifyReply
) => {
  try {
    const { email, password, name } = request.body;

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return reply.status(400).send({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = createUser({
      email,
      password: hashedPassword,
      name
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return reply.status(201).send(userWithoutPassword);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const login = async (
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body;

    // Find user by email
    const user = findUserByEmail(email);
    if (!user) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = request.server.jwt.sign(
      { id: user.id, email: user.email },
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return reply.send({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
}; 