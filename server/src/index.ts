import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes';
import { connectDatabase } from './config/database';
import authPlugin from './plugins/auth';

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: true
});

// Register plugins
fastify.register(cors, {
  origin: true
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
});

fastify.register(authPlugin);

// Connect to MongoDB
connectDatabase(fastify);

// Register routes
fastify.register(userRoutes, { prefix: '/api/users' });

// Health check route
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    fastify.log.info(`Server is running on ${fastify.server.address()}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 