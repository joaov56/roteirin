import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { itineraryRoutes } from './routes/itinerary';


// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Create Fastify instance
const server = Fastify({
  logger: true
});

// Register plugins
server.register(cors, {
  origin: true,
  credentials: true
});

// Register routes
server.register(itineraryRoutes, { prefix: '/api' });

// Health check route
server.get('/health', async () => {
  return { status: 'ok' };
});

// Start server
const start = async () => {
  try {
    await server.listen({ port: Number(PORT), host: '0.0.0.0' });
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 