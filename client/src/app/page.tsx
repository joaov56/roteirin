'use client';

import { useState } from 'react';
import ItineraryForm from '@/components/ItineraryForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import { Itinerary, ItineraryRequest, generateItinerary } from '@/services/api';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ItineraryRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateItinerary(data);
      setItinerary(result);
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError('Failed to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Roteirin</h1>
          <p className="text-xl text-gray-600">Your AI-powered travel itinerary planner</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ItineraryForm onSubmit={handleSubmit} isLoading={isLoading} />
            
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating your personalized itinerary...</p>
                </div>
              </div>
            ) : itinerary ? (
              <ItineraryDisplay 
                itinerary={itinerary} 
                onItineraryUpdate={setItinerary} 
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
                <div className="text-center p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to plan your trip?</h3>
                  <p className="text-gray-600">
                    Fill out the form with your destination and travel dates to get a personalized itinerary.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
