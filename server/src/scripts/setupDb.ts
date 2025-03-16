import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * This script initializes the database connection and runs any pending migrations.
 * It can be used to set up the database for the first time or update it after schema changes.
 */
async function setupDatabase() {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Run migrations if synchronize is disabled
    if (!AppDataSource.options.synchronize) {
      console.log('Running migrations...');
      await AppDataSource.runMigrations();
      console.log('Migrations completed successfully');
    } else {
      console.log('Database schema synchronized automatically');
    }

    // Close the connection
    await AppDataSource.destroy();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during database setup:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 