'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPinIcon, PlaneIcon, TrashIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ItineraryItem {
  id: string;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  order: number;
  activities: Array<{
    title: string;
    location: string;
  }>;
  date: string;
}

interface SavedItinerary {
  id: string;
  destination: string;
  userId: string;
  items: ItineraryItem[];
}

export default function SavedItinerariesPage() {
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if authentication is still loading
    if (authLoading) {
      return;
    }
    
    // If auth is done loading and there's no user, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }
    
    // If we have a user, fetch the itineraries
    fetchItineraries();
  }, [user, authLoading, router]);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/itinerary', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch itineraries');
      }

      const data = await response.json();
      console.log(data);
      setItineraries(data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      toast.error('Failed to fetch saved itineraries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/itinerary/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete itinerary');
      }

      setItineraries(itineraries.filter(itinerary => itinerary.id !== id));
      toast.success('Itinerary deleted successfully');
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast.error('Failed to delete itinerary');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Saved Itineraries</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Saved Itineraries</h1>
      
      {itineraries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">You don&apos;t have any saved itineraries yet.</p>
            <Button 
              className="mt-4" 
              onClick={() => router.push('/')}
            >
              Create an Itinerary
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2"><PlaneIcon className="h-6 w-6" size={32} />{itinerary.destination}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(itinerary.id)}
                    className="text-primary-foreground hover:text-primary-foreground/80"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                
              </CardHeader>
              
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Places</h3>
                <div className="space-y-3">
                  {itinerary.items
                    .sort((a, b) => a.order - b.order)
                    .slice(0, 3)
                    .map((item) => (
                      <div key={item.id}>
                        <div className="font-medium">{item.activities[0].title} - {item.date}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          <span>{item.activities[0].location}</span>
                        </div>
                      </div>
                    ))}
                  
                  {itinerary.items.length > 3 && (
                    <div className="text-sm text-muted-foreground">
                      +{itinerary.items.reduce((total, item) => total + (item.activities?.length || 0), 0) - 
                        (itinerary.items.slice(0, 3).reduce((total, item) => total + (item.activities?.length || 0), 0))} more activities
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/saved-itineraries/${itinerary.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 