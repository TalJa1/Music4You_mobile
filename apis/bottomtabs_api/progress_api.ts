import axiosClient from '../axiosClient';
import { ProgressInterface, ProgressInterfaceArray } from '../../services/models/API_Models';

export const getUserProgressByUserId = async (user_id: number): Promise<ProgressInterfaceArray> => {
  return await axiosClient.get(`/user-progress/by-user/${user_id}`);
};

export const createUserProgress = async (progress: Omit<ProgressInterface, 'id'>): Promise<ProgressInterface> => {
  return await axiosClient.post('/user-progress', progress);
};
