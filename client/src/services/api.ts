import axiosInstance from '@/lib/axios';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  preferences?: string[];
}

export interface Activity {
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

export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  items: DayPlan[];
}

export const generateItinerary = async (data: ItineraryRequest): Promise<Itinerary> => {
  try {
    const response = await api.post<Itinerary>('/itinerary', data);
    return response.data;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
};

export const regenerateItineraryItem = async (
  itineraryId: string,
  itemIndex: number,
  budget?: number
): Promise<Itinerary> => {
  try {
    const response = await api.post<Itinerary>('/itinerary/regenerate-item', {
      itineraryId,
      itemIndex,
      budget,
    });
    return response.data;
  } catch (error) {
    console.error('Error regenerating itinerary item:', error);
    throw error;
  }
};

export const getUserItineraries = async (): Promise<Itinerary[]> => {
  try {
    const response = await axiosInstance.get<{ itineraries: Itinerary[] }>('/itinerary/user');
    return response.data.itineraries;
  } catch (error) {
    console.error('Error fetching user itineraries:', error);
    throw error;
  }
};

export default api; 