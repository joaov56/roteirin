import mongoose, { Schema, Document } from 'mongoose';

// Interface for Activity
interface IActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  bookingLink: string;
  isPaid: boolean;
}

// Interface for ItineraryItem
export interface IItineraryItem extends Document {
  itineraryId: mongoose.Types.ObjectId;
  day: number;
  date: string;
  activities: IActivity[];
}

// Interface for Itinerary
export interface IItinerary extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  destination: string;
  startDate: string;
  finalDate: string;
  budget?: number;
}

// Schema for Activity
const ActivitySchema = new Schema<IActivity>({
  id: { type: String, required: true },
  time: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  bookingLink: { type: String, default: '' },
  isPaid: { type: Boolean, required: true }
});

// Schema for ItineraryItem
const ItineraryItemSchema = new Schema<IItineraryItem>({
  itineraryId: { type: Schema.Types.ObjectId, ref: 'Itinerary', required: true },
  day: { type: Number, required: true },
  date: { type: String, required: true },
  activities: [ActivitySchema]
}, {
  timestamps: true
});

// Schema for Itinerary
const ItinerarySchema = new Schema<IItinerary>({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  destination: { type: String, required: true },
  startDate: { type: String, required: true },
  finalDate: { type: String, required: true },
  budget: { type: Number }
}, {
  timestamps: true
});

// Create indexes
ItineraryItemSchema.index({ itineraryId: 1 });
ItinerarySchema.index({ userId: 1 });

// Export models
export const Itinerary = mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
export const ItineraryItem = mongoose.model<IItineraryItem>('ItineraryItem', ItineraryItemSchema); 