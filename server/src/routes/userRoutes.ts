import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/userController';

export async function userRoutes(fastify: FastifyInstance) {
  // Register new user
  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      }
    }
  }, userController.register);

  // Login user
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, userController.login);

  // Social login
  fastify.post('/social-login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'provider', 'accessToken'],
        properties: {
          email: { type: 'string', format: 'email' },
          provider: { type: 'string' },
          accessToken: { type: 'string' }
        }
      }
    }
  }, userController.socialLogin);

  // Get user profile (protected route)
  fastify.get('/profile', {
    onRequest: [fastify.authenticate]
  }, userController.getProfile);
} 