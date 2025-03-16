import { FastifyRequest, FastifyReply } from 'fastify';
import { ItineraryService, generateItinerary } from '../services/itineraryService';
import { Itinerary as DbItinerary } from '../entities/Itinerary';

interface CreateItineraryRequest {
  Body: {
    name: string;
    items: any[];
  };
}

interface GenerateItineraryRequest {
  Body: {
    destination: string;
    startDate: string;
    endDate: string;
    budget?: number;
    preferences?: string[];
  };
}

interface ParamsWithId {
  Params: {
    id: string;
  };
}

// Define the authenticated user type
interface AuthenticatedUser {
  id: string;
  email: string;
}

// Extend FastifyRequest to include our authenticatedUser property
interface AuthenticatedRequest extends FastifyRequest {
  authenticatedUser: AuthenticatedUser;
}

export class ItineraryController {
  private itineraryService: ItineraryService;

  constructor() {
    this.itineraryService = new ItineraryService();
  }

  public async create(
    request: FastifyRequest<CreateItineraryRequest>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { name, items } = request.body;
      const userId = (request as AuthenticatedRequest).authenticatedUser.id;

      const itinerary = await this.itineraryService.create({
        name,
        userId,
        items
      });

      return reply.code(201).send(itinerary);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to create itinerary' });
    }
  }

  public async findByUser(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const userId = (request as AuthenticatedRequest).authenticatedUser.id;
      const itineraries = await this.itineraryService.findByUserId(userId);

      return reply.send(itineraries);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to find itineraries' });
    }
  }

  public async findById(
    request: FastifyRequest<ParamsWithId>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const itinerary = await this.itineraryService.findById(id);

      if (!itinerary) {
        return reply.code(404).send({ error: 'Itinerary not found' });
      }

      // Check if the itinerary belongs to the user
      const authenticatedUserId = (request as AuthenticatedRequest).authenticatedUser.id;
      
      // Since we're now using the API format, we need to check the userId differently
      // We'll need to fetch the DB entity to check ownership
      const dbItinerary = await this.itineraryService['itineraryRepository'].findOne({
        where: { id }
      });
      
      if (!dbItinerary || dbItinerary.userId !== authenticatedUserId) {
        return reply.code(403).send({ error: 'You do not have permission to access this itinerary' });
      }

      return reply.send(itinerary);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to find itinerary' });
    }
  }

  public async delete(
    request: FastifyRequest<ParamsWithId>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      
      // Check if the itinerary exists and belongs to the user
      const dbItinerary = await this.itineraryService['itineraryRepository'].findOne({
        where: { id }
      });
      
      if (!dbItinerary) {
        return reply.code(404).send({ error: 'Itinerary not found' });
      }

      // Check if the itinerary belongs to the user
      const authenticatedUserId = (request as AuthenticatedRequest).authenticatedUser.id;
      if (dbItinerary.userId !== authenticatedUserId) {
        return reply.code(403).send({ error: 'You do not have permission to delete this itinerary' });
      }

      await this.itineraryService.delete(id);

      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete itinerary' });
    }
  }

  public async generate(
    request: FastifyRequest<GenerateItineraryRequest>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { destination, startDate, endDate, budget, preferences = [] } = request.body;

      const generatedItinerary = await generateItinerary({
        destination,
        startDate,
        endDate,
        budget,
        preferences
      });

      return reply.send(generatedItinerary);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to generate itinerary' });
    }
  }
} 