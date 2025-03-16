import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

// Use the new DataSource API instead of EntityRepository
const userRepository = AppDataSource.getRepository(User);

// Add these functions to maintain compatibility with existing code
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await userRepository.findOne({ where: { email } });
  return user || null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const user = await userRepository.findOne({ where: { id } });
  return user || null;
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const user = userRepository.create(userData);
  return await userRepository.save(user);
}; 