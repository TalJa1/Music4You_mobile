import axiosClient from '../axiosClient';
import { UserInterface } from '../../services/models/API_Models';

export const createUser = async (
  userData: Omit<UserInterface, 'id' | 'created_at'>,
): Promise<UserInterface> => {
  return await axiosClient.post('/users', userData);
};

export const getUserById = async (id: number): Promise<UserInterface> => {
  return await axiosClient.get(`/users/${id}`);
};

export const getUserByEmail = async (
  email: string | undefined,
): Promise<UserInterface> => {
  if (!email) {
    throw new Error('Email is required');
  }
  // console.log(`Fetching user by email: ${email}`);
  return await axiosClient.get(`/users/by-email/${email}`);
};
