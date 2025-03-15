import { FastifyRequest, FastifyReply } from 'fastify';
import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify: () => Promise<any>;
  }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}; 