import mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';

export async function connectDatabase(app: FastifyInstance) {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/roteirin';
    
    await mongoose.connect(MONGODB_URI);
    
    app.log.info('Connected to MongoDB successfully');
    
    mongoose.connection.on('error', (error) => {
      app.log.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      app.log.warn('MongoDB disconnected');
    });

  } catch (error) {
    app.log.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
} 