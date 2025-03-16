'use client';

import { useState } from 'react';
import { Itinerary, regenerateItineraryItem } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, DollarSignIcon, RefreshCwIcon } from 'lucide-react';
import SaveItineraryButton from './SaveItineraryButton';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onItineraryUpdate: (updatedItinerary: Itinerary) => void;
}

export default function ItineraryDisplay({ itinerary, onItineraryUpdate }: ItineraryDisplayProps) {
  const [regeneratingItems, setRegeneratingItems] = useState<Record<string, boolean>>({});
  
  const handleRegenerateItem = async (dayIndex: number, activityIndex: number) => {
    const itemKey = `${dayIndex}-${activityIndex}`;
    try {
      setRegeneratingItems(prev => ({ ...prev, [itemKey]: true }));
      
      const updatedItinerary = await regenerateItineraryItem(
        itinerary.id,
        activityIndex,
        itinerary.budget
      );
      
      onItineraryUpdate(updatedItinerary);
    } catch (error) {
      console.error('Error regenerating item:', error);
    } finally {
      setRegeneratingItems(prev => ({ ...prev, [itemKey]: false }));
    }
  };
  
  const formatCurrency = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <div className="text-sm">
              {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
            </div>
          </div>
          <SaveItineraryButton itinerary={itinerary} />
        </div>
        <CardTitle className="text-2xl">{itinerary.destination}</CardTitle>
        {itinerary.budget && (
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <DollarSignIcon className="h-4 w-4" />
            <span>Budget: ${itinerary.budget}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        {itinerary.items.map((day, dayIndex) => (
          <div key={dayIndex} className="border-b border-border last:border-0">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Day {day.day}: {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              
              <div className="space-y-6">
                {day.activities.map((activity, activityIndex) => (
                  <Card key={activity.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {activity.time}
                          </Badge>
                          <h4 className="text-lg font-medium">{activity.title}</h4>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRegenerateItem(dayIndex, activityIndex)}
                          disabled={regeneratingItems[`${dayIndex}-${activityIndex}`]}
                        >
                          {regeneratingItems[`${dayIndex}-${activityIndex}`] ? (
                            <span className="flex items-center gap-1">
                              <RefreshCwIcon className="h-4 w-4 animate-spin" />
                              Regenerating
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <RefreshCwIcon className="h-4 w-4" />
                              Regenerate
                            </span>
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-muted-foreground mt-2">{activity.description}</p>
                      
                      <Separator className="my-3" />
                      
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                        
                        {activity.isPaid && (
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <DollarSignIcon className="h-4 w-4" />
                              <span>{formatCurrency(activity.price, activity.currency)}</span>
                            </div>
                            
                            {activity.bookingLink && (
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto"
                                asChild
                              >
                                <a
                                  href={activity.bookingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Book now
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 