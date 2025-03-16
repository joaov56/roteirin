import { FastifyRequest, FastifyReply } from 'fastify';
import '@fastify/jwt';
import { findUserById } from '../repositories/UserRepository';

// Define a custom interface for the user property
interface RequestWithUser extends FastifyRequest {
  user: {
    id: string;
    email: string;
  }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    
    // Get user from database to ensure they still exist
    const decodedToken = request.user as { id: string, email: string };
    const user = await findUserById(decodedToken.id);
    
    if (!user) {
      return reply.status(401).send({ error: 'Authentication failed' });
    }
    
    // Add user to request for use in route handlers
    (request as any).user = { id: user.id, email: user.email };
  } catch (err) {
    reply.status(401).send({ error: 'Authentication required' });
  }
}; 