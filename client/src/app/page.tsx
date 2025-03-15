'use client';

import { useState } from 'react';
import ItineraryForm from '@/components/ItineraryForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import { Itinerary, ItineraryRequest, generateItinerary } from '@/services/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const handleSubmit = async (data: ItineraryRequest) => {
    setIsLoading(true);
    
    try {
      const result = await generateItinerary(data);
      setItinerary(result);
      toast.success('Itinerary generated successfully!');
    } catch (err) {
      console.error('Error generating itinerary:', err);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-2">AI Travel Itinerary Generator</h1>
            <p className="text-xl text-muted-foreground">Plan your perfect trip with personalized recommendations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ItineraryForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
            
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center h-64 bg-card rounded-lg shadow">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Generating your personalized itinerary...</p>
                  </div>
                </div>
              ) : itinerary ? (
                <ItineraryDisplay 
                  itinerary={itinerary} 
                  onItineraryUpdate={(updated) => {
                    setItinerary(updated);
                    toast.success('Activity regenerated successfully!');
                  }} 
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-card rounded-lg shadow">
                  <div className="text-center p-6">
                    <h3 className="text-xl font-semibold mb-2">Ready to plan your trip?</h3>
                    <p className="text-muted-foreground">
                      Fill out the form with your destination and travel dates to get a personalized itinerary.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
