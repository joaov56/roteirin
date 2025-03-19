'use client';

import { useState } from 'react';
import { Itinerary, regenerateItineraryItem } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, DollarSignIcon, RefreshCwIcon, ListIcon, SaveIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Toggle } from '@/components/ui/toggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onItineraryUpdate: (updatedItinerary: Itinerary) => void;
}

export default function ItineraryDisplay({ itinerary, onItineraryUpdate }: ItineraryDisplayProps) {
  const [regeneratingItems, setRegeneratingItems] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    itinerary.items.length > 0 ? new Date(itinerary.items[0].date) : undefined
  );
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [itineraryName, setItineraryName] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  
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
  
  const getDayActivities = (date: Date) => {
    const day = itinerary.items.find(
      (day) => new Date(day.date).toDateString() === date.toDateString()
    );
    return day?.activities || [];
  };

  const handleSaveItinerary = async () => {
    try {
      setIsSaving(true);
      
      // Example API call - User will configure this
      // This is just a placeholder structure

      const { status } = await axiosInstance.post('/itinerary/save', {itinerary: {...itinerary, name:itineraryName}});

      if(status !== 200) {
        toast.error('Failed to save itinerary');
        return;
      }
   
      // Close dialog after saving
      setSaveDialogOpen(false);
      setItineraryName('');
      
      // You might want to show a success notification here
    } catch (error) {
      console.error('Error saving itinerary:', error);
      // You might want to show an error notification here
    } finally {
      setIsSaving(false);
    }
  };

  const startDate = new Date(itinerary.startDate);
  const endDate = new Date(itinerary.endDate);

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <div className="text-sm">
                {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setSaveDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <SaveIcon className="h-4 w-4" />
                Save
              </Button>
              <Toggle
                pressed={viewMode === 'calendar'}
                onPressedChange={(pressed: boolean) => setViewMode(pressed ? 'calendar' : 'list')}
                aria-label="Toggle calendar view"
              >
                {viewMode === 'list' ? <CalendarIcon className="h-4 w-4" /> : <ListIcon className="h-4 w-4" />}
              </Toggle>
            </div>
          </div>
          <CardTitle className="text-2xl">{itinerary.destination}</CardTitle>
          {itinerary.budget && (
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <DollarSignIcon className="h-4 w-4" />
              <span>Budget: ${itinerary.budget}</span>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-6">
          {viewMode === 'calendar' ? (
            <div className="space-y-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                fromDate={startDate}
                toDate={endDate}
                className="rounded-md border"
                modifiers={{
                  booked: itinerary.items.map(day => new Date(day.date)),
                }}
                modifiersStyles={{
                  booked: { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }
                }}
              />
              {selectedDate && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="space-y-4">
                    {getDayActivities(selectedDate).map((activity, activityIndex) => (
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
                              onClick={() => handleRegenerateItem(
                                itinerary.items.findIndex(day => 
                                  new Date(day.date).toDateString() === selectedDate.toDateString()
                                ),
                                activityIndex
                              )}
                              disabled={regeneratingItems[`${selectedDate.toDateString()}-${activityIndex}`]}
                            >
                              {regeneratingItems[`${selectedDate.toDateString()}-${activityIndex}`] ? (
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
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {itinerary.items.map((day, dayIndex) => (
                <div key={dayIndex} className="border-b border-border last:border-0 pb-6">
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Itinerary</DialogTitle>
            <DialogDescription>
              Give your itinerary a name to save it for future reference.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itineraryName" className="text-right">
                Name
              </Label>
              <Input
                id="itineraryName"
                placeholder="My Trip to Paris"
                value={itineraryName}
                onChange={(e) => setItineraryName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveItinerary} 
              disabled={!itineraryName.trim() || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 