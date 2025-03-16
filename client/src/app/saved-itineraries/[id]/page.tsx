'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, MapPinIcon, ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

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
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: ItineraryItem[];
}

export default function ItineraryDetailPage() {
  const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user && id) {
      fetchItinerary();
    }
  }, [user, id, router]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/itinerary/${id}`, {
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

  if (loading) {
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
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <div className="text-sm">
              Saved on {new Date(itinerary.createdAt).toLocaleDateString()}
            </div>
          </div>
          <CardTitle className="text-2xl">{itinerary.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Places</h2>
          
          <div className="space-y-6">
            {itinerary.items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Stop {index + 1}
                        </div>
                        <h4 className="text-lg font-medium">{item.name}</h4>
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-muted-foreground mt-2">{item.description}</p>
                    )}
                    
                    <Separator className="my-3" />
                    
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{item.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 