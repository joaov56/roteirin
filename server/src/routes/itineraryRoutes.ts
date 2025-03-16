import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ItineraryController } from '../controllers/itineraryController';
import { authenticate } from '../middlewares/auth';
import { createItinerarySchema, getItinerarySchema } from '../schemas/savedItinerarySchema';

// Schema for the generate itinerary route
const generateItinerarySchema = {
  body: {
    type: 'object',
    required: ['destination', 'startDate', 'endDate'],
    properties: {
      destination: { type: 'string' },
      startDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' },
      budget: { type: 'number' },
      preferences: { 
        type: 'array',
        items: { type: 'string' },
        default: []
      }
    }
  }
};

export async function itineraryRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  const itineraryController = new ItineraryController();

  // Public routes
  fastify.post('/itinerary/generate', {
    schema: generateItinerarySchema,
    handler: itineraryController.generate.bind(itineraryController)
  });

  // Protected routes - require authentication
  fastify.register(async (protectedRoutes) => {
    // Add authentication hook to all routes in this context
    protectedRoutes.addHook('preHandler', authenticate);

    // Saved itineraries routes
    protectedRoutes.post('/itinerary', {
      schema: createItinerarySchema,
      handler: itineraryController.create.bind(itineraryController)
    });

    protectedRoutes.get('/itinerary', {
      handler: itineraryController.findByUser.bind(itineraryController)
    });

    protectedRoutes.get('/itinerary/:id', {
      schema: getItinerarySchema,
      handler: itineraryController.findById.bind(itineraryController)
    });

    protectedRoutes.delete('/itinerary/:id', {
      schema: getItinerarySchema,
      handler: itineraryController.delete.bind(itineraryController)
    });
  });
} 