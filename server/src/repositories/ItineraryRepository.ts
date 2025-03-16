import { EntityRepository, Repository } from 'typeorm';
import { Itinerary } from '../entities/Itinerary';

@EntityRepository(Itinerary)
export class ItineraryRepository extends Repository<Itinerary> {
  public async findByUserId(userId: string): Promise<Itinerary[]> {
    return this.find({
      where: { userId },
      relations: ['items'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  public async findByIdWithItems(id: string): Promise<Itinerary | undefined> {
    const itinerary = await this.findOne({
      where: { id },
      relations: ['items'],
    });
    
    return itinerary || undefined;
  }
} 