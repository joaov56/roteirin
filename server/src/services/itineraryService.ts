import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { AppDataSource } from '../config/database';
import { Itinerary as DbItinerary } from '../entities/Itinerary';
import { ItineraryItem } from '../entities/ItineraryItem';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface ItineraryParams {
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  preferences: string[];
}

interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  bookingLink: string;
  isPaid: boolean;
}

interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
}

interface Itinerary {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  items: DayPlan[];
}

interface CreateItineraryDTO {
  name: string;
  userId: string;
  items: Omit<ItineraryItem, 'id' | 'itinerary' | 'itineraryId'>[];
}

export class ItineraryService {
  private itineraryRepository = AppDataSource.getRepository(DbItinerary);
  private itineraryItemRepository = AppDataSource.getRepository(ItineraryItem);

  public async create({ name, userId, items }: CreateItineraryDTO): Promise<Itinerary> {
    // Create the itinerary
    const itinerary = this.itineraryRepository.create({
      name,
      userId
    });

    await this.itineraryRepository.save(itinerary);

    // Create the itinerary items
    if (items && items.length > 0) {
      const itineraryItems = items.map((item, index) => {
        return this.itineraryItemRepository.create({
          ...item,
          itineraryId: itinerary.id,
          order: index
        });
      });

      await this.itineraryItemRepository.save(itineraryItems);
    }

    const savedItinerary = await this.findById(itinerary.id);
    if (!savedItinerary) {
      throw new Error('Failed to create itinerary');
    }
    
    return savedItinerary;
  }

  public async findByUserId(userId: string): Promise<Itinerary[]> {
    const dbItineraries = await this.itineraryRepository.find({
      where: { userId },
      relations: ['items'],
      order: {
        createdAt: 'DESC'
      }
    });
    
    // Convert DB entities to API Itinerary format
    return dbItineraries.map(dbItinerary => this.convertDbItineraryToApiFormat(dbItinerary));
  }

  public async findById(id: string): Promise<Itinerary | undefined> {
    const dbItinerary = await this.itineraryRepository.findOne({
      where: { id },
      relations: ['items']
    });
    
    if (!dbItinerary) {
      return undefined;
    }
    
    // Convert DB entity to API Itinerary format
    return this.convertDbItineraryToApiFormat(dbItinerary);
  }

  public async delete(id: string): Promise<void> {
    await this.itineraryRepository.delete(id);
  }
  
  // Helper method to convert DB entity to API format
  private convertDbItineraryToApiFormat(dbItinerary: DbItinerary): Itinerary {
    // Create a mock structure that matches the API Itinerary format
    // In a real application, you would map the actual data from the database
    const items: DayPlan[] = dbItinerary.items.map((item, index) => {
      const activity: Activity = {
        id: item.id,
        time: "10:00", // Default time since we don't store this
        title: item.name,
        description: item.description || "",
        location: item.address,
        price: 0, // Default price since we don't store this
        currency: "USD", // Default currency
        bookingLink: "",
        isPaid: false
      };
      
      return {
        day: Math.floor(index / 3) + 1, // Group items into days (3 items per day)
        date: new Date().toISOString().split('T')[0], // Current date as default
        activities: [activity]
      };
    });
    
    // Group activities by day
    const groupedItems: DayPlan[] = [];
    const dayMap = new Map<number, DayPlan>();
    
    items.forEach(item => {
      if (!dayMap.has(item.day)) {
        dayMap.set(item.day, {
          day: item.day,
          date: item.date,
          activities: []
        });
        groupedItems.push(dayMap.get(item.day)!);
      }
      
      dayMap.get(item.day)!.activities.push(...item.activities);
    });
    
    return {
      id: dbItinerary.id,
      destination: dbItinerary.name, // Use name as destination
      startDate: dbItinerary.createdAt.toISOString().split('T')[0], // Use createdAt as startDate
      endDate: new Date(dbItinerary.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // createdAt + 7 days as endDate
      items: groupedItems
    };
  }
}

export async function generateItinerary(params: ItineraryParams): Promise<Itinerary> {
  const { destination, startDate, endDate, budget, preferences } = params;
  
  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Create prompt for OpenAI
  const budgetText = budget ? `with a budget of ${budget}` : 'with no specific budget';
  const preferencesText = preferences.length > 0 
    ? `The traveler has the following preferences: ${preferences.join(', ')}.` 
    : '';
  
  const prompt = `
    Create a detailed ${daysDiff}-day travel itinerary for ${destination} from ${startDate} to ${endDate} ${budgetText}.
    ${preferencesText}
    
    For each activity, include:
    1. A specific time
    2. A descriptive title
    3. A brief description
    4. The exact location
    5. Price information (if applicable)
    6. Currency
    7. Booking link (if applicable)
    
    Format the response as a JSON object with the following structure:
    {
      "items": [
        {
          "day": 1,
          "date": "YYYY-MM-DD",
          "activities": [
            {
              "time": "HH:MM",
              "title": "Activity name",
              "description": "Brief description",
              "location": "Specific location",
              "price": 0, // Numeric value, 0 if free
              "currency": "USD", // Three-letter currency code
              "bookingLink": "https://example.com", // Empty string if not applicable
              "isPaid": false // Boolean indicating if this is a paid activity
            }
          ]
        }
      ]
    }
    
    Make sure to include a mix of popular attractions, local experiences, and dining options.
    If an activity is paid, provide accurate price information and booking links when possible.
    ${budget ? 'Ensure the total cost of activities fits within the specified budget.' : ''}
  `;

  try {
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a travel planning assistant that creates detailed, personalized itineraries." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const parsedResponse = JSON.parse(content);
    
    // Add unique IDs to each activity
    const itemsWithIds = parsedResponse.items.map((day: any) => ({
      ...day,
      activities: day.activities.map((activity: any) => ({
        id: uuidv4(),
        ...activity
      }))
    }));

    // Create the final itinerary object
    const itinerary: Itinerary = {
      id: uuidv4(),
      destination,
      startDate,
      endDate,
      budget,
      items: itemsWithIds
    };

    return itinerary;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary');
  }
}

export async function regenerateItem(
  itineraryId: string,
  itemIndex: number,
  budget?: number
): Promise<Itinerary> {
  try {
    // In a real application, you would fetch the existing itinerary from a database
    // For this demo, we'll create a mock itinerary with a single regenerated activity
    
    const mockActivity: Activity = {
      id: uuidv4(),
      time: "14:00",
      title: "Regenerated Activity",
      description: "This is a regenerated activity. In a real application, this would be generated by the OpenAI API based on the existing itinerary.",
      location: "Regenerated Location",
      price: budget ? budget * 0.1 : 0,
      currency: "USD",
      bookingLink: "https://example.com/booking",
      isPaid: budget ? true : false
    };
    
    // Create a mock itinerary with the regenerated activity
    const mockItinerary: Itinerary = {
      id: itineraryId,
      destination: "Sample Destination",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget,
      items: [
        {
          day: 1,
          date: new Date().toISOString().split('T')[0],
          activities: [mockActivity]
        }
      ]
    };
    
    return mockItinerary;
  } catch (error) {
    console.error('Error regenerating item:', error);
    throw new Error('Failed to regenerate item');
  }
} 