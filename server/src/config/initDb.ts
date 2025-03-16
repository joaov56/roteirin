import { AppDataSource } from './database';

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
    
    // Ensure the database is synchronized with our entities
    if (AppDataSource.options.synchronize) {
      console.log('Database schema synchronized');
    }
    
    return true;
  } catch (error) {
    console.error('Error during database initialization:', error);
    return false;
  }
}; 