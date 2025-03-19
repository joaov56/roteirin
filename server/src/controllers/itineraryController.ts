import { FastifyRequest, FastifyReply } from 'fastify';
import { generateItinerary, saveItinerary } from '../services/itineraryService';
import { IItinerary } from '../models/itinerary.model';


interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  preferences?: string[];
}

interface SaveItineraryRequest {
  itinerary: {
    id: string;
    destination: string;
    name?: string;
    startDate: string;
    endDate: string;
    userId: string;
    budget?: number;
    items: Array<{
      day: number;
      date: string;
      activities: Array<{
        id: string;
        time: string;
        title: string;
        description: string;
        location: string;
        price: number;
        currency: string;
        bookingLink: string;
        isPaid: boolean;
      }>;
    }>;
  };
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

export async function saveItineraryController(
  request: FastifyRequest<{ Body: SaveItineraryRequest }>,
  reply: FastifyReply
  ) {
  const { itinerary } = request.body;
  console.log(itinerary)
  console.log(request.user)
    
  itinerary.userId = request.user.userId
  const savedItinerary = await saveItinerary(itinerary);
  console.log(savedItinerary)

  return reply.code(200).send('a')
}