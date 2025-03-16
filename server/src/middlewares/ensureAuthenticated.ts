import { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

// Instead of extending the FastifyRequest interface directly,
// we'll use type casting in our functions
interface UserPayload {
  id: string;
  email: string;
}

export async function ensureAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
    
    // Get user from database to ensure they still exist
    const decodedToken = request.user as UserPayload;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decodedToken.id }
    });
    
    if (!user) {
      return reply.status(401).send({ error: 'Authentication failed' });
    }
    
    // Store the user info in request for later use
    (request as any).authenticatedUser = {
      id: decodedToken.id,
      email: decodedToken.email
    };
  } catch (err) {
    return reply.status(401).send({ error: 'Authentication required' });
  }
} 