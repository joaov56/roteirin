'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import UserItineraryDisplay from '@/components/UserItineraryDisplay';

interface ItineraryItem {
  id: string;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  order: number;
}

interface SavedItinerary {
  id: string;
  destination: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: ItineraryItem[];
}

export default function ItineraryDetailPage() {
  const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    // If we have a user and an ID, fetch the itinerary
    if (id) {
      fetchItinerary();
    }
  }, [user, authLoading, id, router]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/itinerary/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Itinerary not found');
          router.push('/saved-itineraries');
          return;
        }
        throw new Error('Failed to fetch itinerary');
      }

      const data = await response.json();
      setItinerary(data);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      toast.error('Failed to fetch itinerary details');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Itinerary Details</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Itinerary Details</h1>
        <p>Itinerary not found</p>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/saved-itineraries')}
        >
          Back to Saved Itineraries
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => router.push('/saved-itineraries')}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Saved Itineraries
      </Button>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <div className="text-sm">
                Saved on {new Date(itinerary.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl">{itinerary.destination}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="border-b border-border">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Itinerary</h2>
              
              <UserItineraryDisplay itinerary={{...itinerary, startDate: itinerary.createdAt, endDate: itinerary.updatedAt}} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 