'use client';

import { useState } from 'react';
import { Itinerary, regenerateItineraryItem } from '@/services/api';

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 p-6 text-white">
        <h2 className="text-2xl font-bold">{itinerary.destination}</h2>
        <p className="text-blue-100">
          {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
        </p>
        {itinerary.budget && (
          <p className="text-blue-100 mt-1">Budget: ${itinerary.budget}</p>
        )}
      </div>
      
      <div className="divide-y divide-gray-200">
        {itinerary.items.map((day, dayIndex) => (
          <div key={dayIndex} className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Day {day.day}: {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            
            <div className="space-y-6">
              {day.activities.map((activity, activityIndex) => (
                <div key={activity.id} className="bg-gray-50 p-4 rounded-lg relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                        {activity.time}
                      </span>
                      <h4 className="text-lg font-medium text-gray-800">{activity.title}</h4>
                    </div>
                    
                    <button
                      onClick={() => handleRegenerateItem(dayIndex, activityIndex)}
                      disabled={regeneratingItems[`${dayIndex}-${activityIndex}`]}
                      className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    >
                      {regeneratingItems[`${dayIndex}-${activityIndex}`] ? (
                        <span>Regenerating...</span>
                      ) : (
                        <span>Regenerate</span>
                      )}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mt-2">{activity.description}</p>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    <p>📍 {activity.location}</p>
                    
                    {activity.isPaid && (
                      <p className="mt-1">
                        💰 {formatCurrency(activity.price, activity.currency)}
                        {activity.bookingLink && (
                          <a
                            href={activity.bookingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Book now
                          </a>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 