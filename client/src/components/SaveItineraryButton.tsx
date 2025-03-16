'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SaveIcon } from 'lucide-react';
import { Itinerary } from '@/services/api';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface SaveItineraryButtonProps {
  itinerary: Itinerary;
}

export default function SaveItineraryButton({ itinerary }: SaveItineraryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name for your itinerary');
      return;
    }

    try {
      setIsSaving(true);

      // Transform the itinerary data to match the expected format
      const items = itinerary.items.flatMap((day, dayIndex) => 
        day.activities.map((activity, activityIndex) => ({
          name: activity.title,
          address: activity.location,
          description: activity.description,
          latitude: 0, // We would need to get these from a geocoding service
          longitude: 0, // We would need to get these from a geocoding service
          order: dayIndex * 100 + activityIndex // Simple ordering scheme
        }))
      );

      // Call the API to save the itinerary
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name,
          items
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save itinerary');
      }

      toast.success('Itinerary saved successfully');

      setIsOpen(false);
      setName('');
    } catch (error) {
      console.error('Error saving itinerary:', error);
      toast.error('Failed to save itinerary');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <Button variant="outline" disabled>
        <SaveIcon className="h-4 w-4 mr-2" />
        Login to Save
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Itinerary
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Itinerary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Itinerary Name</Label>
            <Input
              id="name"
              placeholder="Enter a name for your itinerary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 