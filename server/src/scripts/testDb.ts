import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { createUser, findUserByEmail } from '../repositories/UserRepository';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * This script tests the database connection and user repository functions.
 * It creates a test user and then retrieves it from the database.
 */
async function testDatabase() {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Create a test user
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`Creating test user with email: ${testEmail}`);
    
    const user = await createUser({
      email: testEmail,
      password: 'password123',
      name: 'Test User'
    });
    
    console.log('Test user created:', {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    });

    // Retrieve the user
    const retrievedUser = await findUserByEmail(testEmail);
    
    if (retrievedUser) {
      console.log('Successfully retrieved user from database');
      console.log({
        id: retrievedUser.id,
        email: retrievedUser.email,
        name: retrievedUser.name,
        createdAt: retrievedUser.createdAt
      });
    } else {
      console.error('Failed to retrieve user from database');
    }

    // Close the connection
    await AppDataSource.destroy();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during database test:', error);
    process.exit(1);
  }
}

// Run the test
testDatabase(); 