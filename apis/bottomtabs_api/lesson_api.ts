import axiosClient from '../axiosClient';
import { LessonInterface, LessonInterfaceArray } from '../../services/models/API_Models';

// Get all lessons
export const getLessons = async (): Promise<LessonInterfaceArray> => {
  return await axiosClient.get('/lessons');
};

// Get a lesson by ID
export const getLessonById = async (id: number): Promise<LessonInterface> => {
  return await axiosClient.get(`/lessons/${id}`);
};

// Create a new lesson
export const createLesson = async (lesson: Omit<LessonInterface, 'id'>): Promise<LessonInterface> => {
  return await axiosClient.post('/lessons', lesson);
};

// Update a lesson by ID
export const updateLesson = async (id: number, lesson: Partial<Omit<LessonInterface, 'id'>>): Promise<LessonInterface> => {
  return await axiosClient.put(`/lessons/${id}`, lesson);
};

// Delete a lesson by ID
export const deleteLesson = async (id: number): Promise<void> => {
  await axiosClient.delete(`/lessons/${id}`);
};
