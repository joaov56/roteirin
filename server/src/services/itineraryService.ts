import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { IItineraryItem, Itinerary, ItineraryItem } from '../models/itinerary.model';

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

interface IItinerary {
  id: string;
  destination: string;
  name?: string;
  startDate: string;
  userId?: string;
  endDate: string;
  budget?: number;
  items: DayPlan[];
}

export async function generateItinerary(params: ItineraryParams): Promise<IItinerary> {
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
    const itinerary: IItinerary = {
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

export async function saveItinerary(itinerary: IItinerary) {
  try {
    const itineraryInfo = {
      name: itinerary.name,
      destination: itinerary.destination,
      userId: itinerary.userId,
      startDate: itinerary.startDate,
      finalDate: itinerary.endDate,
      budget: itinerary.budget
    }

    const savedItinerary = await Itinerary.create(itineraryInfo)

    const itineraryItems  = itinerary.items.map((item) => ({
      itineraryId: savedItinerary._id,
      day: item.day,
      date: item.date,
      activities: item.activities,
    }))

    const savedItineraryItems = await ItineraryItem.create(itineraryItems)

    return {savedItinerary, savedItineraryItems}
  } catch (error) {
    console.error('Error saving itinerary:', error);
    throw new Error('Failed to save itinerary');
  }
}

export async function regenerateItem(
  itineraryId: string,
  itemIndex: number,
  budget?: number
): Promise<IItinerary> {
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
    const mockItinerary: IItinerary = {
      id: itineraryId,
      destination: "Sample Destination",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      userId: '',
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

export async function getUserItineraries(userId: string) {
  try {
    const userItineraries = await Itinerary.find({ userId });
    
    const itinerariesWithItems = await Promise.all(
      userItineraries.map(async (itinerary) => {
        const items = await ItineraryItem.find({ itineraryId: itinerary._id }).sort({ day: 1 });
        
        return {
          id: itinerary._id,
          destination: itinerary.destination,
          name: itinerary.name,
          startDate: itinerary.startDate,
          endDate: itinerary.finalDate,
          budget: itinerary.budget,
          items
        };
      })
    );
    
    return itinerariesWithItems;
  } catch (error) {
    console.error('Error fetching user itineraries:', error);
    throw new Error('Failed to fetch user itineraries');
  }
} 