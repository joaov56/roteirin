import { EntityRepository, Repository } from 'typeorm';
import { ItineraryItem } from '../entities/ItineraryItem';

@EntityRepository(ItineraryItem)
export class ItineraryItemRepository extends Repository<ItineraryItem> {
  public async findByItineraryId(itineraryId: string): Promise<ItineraryItem[]> {
    return this.find({
      where: { itineraryId },
      order: {
        order: 'ASC'
      }
    });
  }
} 