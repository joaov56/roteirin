'use client';

import { useState } from 'react';
import { ItineraryRequest } from '@/services/api';

interface ItineraryFormProps {
  onSubmit: (data: ItineraryRequest) => void;
  isLoading: boolean;
}

export default function ItineraryForm({ onSubmit, isLoading }: ItineraryFormProps) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [preferences, setPreferences] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: ItineraryRequest = {
      destination,
      startDate,
      endDate,
      ...(budget && { budget: Number(budget) }),
      ...(preferences && { preferences: preferences.split(',').map(p => p.trim()) })
    };
    
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Plan Your Trip</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Paris, France"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget (optional)
          </label>
          <input
            id="budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Your budget in USD"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-1">
            Preferences (optional, comma-separated)
          </label>
          <input
            id="preferences"
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g., museums, food, hiking"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Generating Itinerary...' : 'Generate Itinerary'}
        </button>
      </form>
    </div>
  );
} 