import axiosClient from '../axiosClient';
import {
  CreateProgressInterface,
  ProgressInterfaceArray,
} from '../../services/models/API_Models';

export const getUserProgressByUserId = async (
  user_id: number,
): Promise<ProgressInterfaceArray> => {
  return await axiosClient.get(`/user-progress/by-user/${user_id}`);
};

export const createUserProgress = async (
  progress: Omit<CreateProgressInterface, 'id'>,
): Promise<CreateProgressInterface> => {
  return await axiosClient.post('/user-progress', progress);
};

export const getUserProgressByUserIdAndLessonId = async (
  user_id: number,
  lesson_id: number,
): Promise<ProgressInterfaceArray> => {
  return await axiosClient.get(`/user-progress/by-user-lesson/${user_id}/${lesson_id}`);
};