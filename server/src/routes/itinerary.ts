import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { regenerateItem } from '../services/itineraryService';
import { getUserItinerariesSchema, itinerarySchema, saveItinerarySchema } from '../schemas/itinerarySchema';
import { 
  generateItineraryController, 
  saveItineraryController,
  getUserItinerariesController
} from '../controllers/itineraryController';

export async function itineraryRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  // Generate a new itinerary
  fastify.post('/', {
    schema: itinerarySchema,
    handler: generateItineraryController
  });

  // Regenerate a specific item in the itinerary
  fastify.post('/itinerary/regenerate-item', {
    schema: {
      body: {
        type: 'object',
        required: ['itineraryId', 'itemIndex'],
        properties: {
          itineraryId: { type: 'string' },
          itemIndex: { type: 'number' },
          budget: { type: 'number' }
        }
      }
    },
    handler: async (request, reply) => {
      const { itineraryId, itemIndex, budget } = request.body as {
        itineraryId: string;
        itemIndex: number;
        budget?: number;
      };
      
      try {
        const updatedItinerary = await regenerateItem(
          itineraryId,
          itemIndex,
          budget
        );
        
        return reply.code(200).send(updatedItinerary);
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Failed to regenerate itinerary item' });
      }
    }
  });

  fastify.post('/save', {
    schema: saveItinerarySchema,
    preValidation: [fastify.authenticate],
    handler: saveItineraryController
  })

  // Get all itineraries for the logged-in user
  fastify.get('/user', {
    schema: getUserItinerariesSchema,
    preValidation: [fastify.authenticate],
    handler: getUserItinerariesController
  });
} 