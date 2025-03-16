import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { regenerateItem } from '../services/itineraryService';
import { itinerarySchema } from '../schemas/itinerarySchema';
import { ItineraryController } from '../controllers/itineraryController';

export async function itineraryRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  const itineraryController = new ItineraryController();

  // Generate a new itinerary
  fastify.post('/itinerary', {
    schema: itinerarySchema,
    handler: itineraryController.generate.bind(itineraryController)
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
} 