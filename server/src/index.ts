import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { itineraryRoutes } from './routes/itinerary';
import { authRoutes } from './routes/auth';
import { initializeDatabase } from './config/initDb';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Create Fastify instance
const server = Fastify({
  logger: true
});

// Register plugins
server.register(cors, {
  origin: true,
  credentials: true
});

server.register(jwt, {
  secret: JWT_SECRET
});

// Register routes
server.register(itineraryRoutes, { prefix: '/api' });
server.register(authRoutes, { prefix: '/api/auth' });

// Health check route
server.get('/health', async () => {
  return { status: 'ok' };
});

// Start server
const start = async () => {
  try {
    // Initialize database connection
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      throw new Error('Failed to initialize database');
    }
    
    await server.listen({ port: Number(PORT), host: '0.0.0.0' });
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 