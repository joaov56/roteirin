import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService';

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface SocialLoginBody {
  email: string;
  provider: string;
  accessToken: string;
}

interface AuthenticatedRequest extends FastifyRequest {
  user: {
    userId: string;
    email: string;
  };
}

const userService = new UserService();

export const userController = {
  async register(request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) {
    try {
      const { name, email, password } = request.body;

      const user = await userService.register(name, email, password);

      // Generate JWT token
      const token = await reply.jwtSign({
        userId: user.id,
        email: user.email
      });

      return reply.status(201).send({ user, token });
    } catch (error: any) {
      request.log.error(error);
      if (error?.message === 'Email already registered') {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  },

  async login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body;

      const user = await userService.login(email, password);

      // Generate JWT token
      const token = await reply.jwtSign({
        userId: user.id,
        email: user.email
      });

      return reply.send({ user, token });
    } catch (error: any) {
      request.log.error(error);
      if (error?.message === 'Invalid credentials') {
        return reply.status(401).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  },

  async socialLogin(request: FastifyRequest<{ Body: SocialLoginBody }>, reply: FastifyReply) {
    try {
      const { email, provider, accessToken } = request.body;

      const user = await userService.socialLogin(email, provider, accessToken);

      // Generate JWT token
      const token = await reply.jwtSign({
        userId: user.id,
        email: user.email
      });

      return reply.send({ user, token });
    } catch (error: any) {
      request.log.error(error);
      if (error?.message === 'User not found') {
        return reply.status(404).send({ error: error.message });
      }
      if (error?.message === 'Invalid access token') {
        return reply.status(401).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  },

  async getProfile(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const userId = request.user.userId;
      const user = await userService.getProfile(userId);
      return reply.send({ user });
    } catch (error: any) {
      request.log.error(error);
      if (error?.message === 'User not found') {
        return reply.status(404).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}; 