import { FastifyInstance } from 'fastify';
import { register, login } from '../controllers/auth';
import { registerSchema, loginSchema } from '../schemas/auth';

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/register', { schema: registerSchema }, register);
  fastify.post('/login', { schema: loginSchema }, login);
}; 