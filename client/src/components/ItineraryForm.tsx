'use client';

import { useState } from 'react';
import { ItineraryRequest } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ItineraryFormProps {
  onSubmit: (data: ItineraryRequest) => void;
  isLoading: boolean;
}

export default function ItineraryForm({ onSubmit, isLoading }: ItineraryFormProps) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [budget, setBudget] = useState<string>('');
  const [preferences, setPreferences] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      return;
    }
    
    const formData: ItineraryRequest = {
      destination,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      ...(budget && { budget: Number(budget) }),
      ...(preferences && { preferences: preferences.split(',').map(p => p.trim()) })
    };
    
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Your Trip</CardTitle>
        <CardDescription>
          Enter your destination and travel dates to get a personalized itinerary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., Paris, France"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => 
                      (startDate ? date < startDate : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (optional)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="Your budget in USD"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferences">Preferences (optional, comma-separated)</Label>
            <Textarea
              id="preferences"
              placeholder="e.g., museums, food, hiking"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !destination || !startDate || !endDate}
          >
            {isLoading ? 'Generating Itinerary...' : 'Generate Itinerary'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 