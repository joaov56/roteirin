import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

export const UserRepository = AppDataSource.getRepository(User);

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await UserRepository.findOne({ where: { email } });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return await UserRepository.findOne({ where: { id } });
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const user = UserRepository.create(userData);
  return await UserRepository.save(user);
}; 