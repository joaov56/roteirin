import { FastifyRequest, FastifyReply } from 'fastify';
import { generateItinerary } from '../services/itineraryService';


interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  preferences?: string[];
}

export async function generateItineraryController(
  request: FastifyRequest<{ Body: ItineraryRequest }>,
  reply: FastifyReply
) {
  try {
    const { destination, startDate, endDate, budget, preferences } = request.body;
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return reply.code(400).send({ error: 'Invalid date format' });
    }
    
    if (start > end) {
      return reply.code(400).send({ error: 'Start date must be before end date' });
    }
    
    // Generate itinerary
    const itinerary = await generateItinerary({
      destination,
      startDate,
      endDate,
      budget,
      preferences: preferences || []
    });
    
    return reply.code(200).send(itinerary);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Failed to generate itinerary' });
  }
} 