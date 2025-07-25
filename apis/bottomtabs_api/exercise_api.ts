import axiosClient from '../axiosClient';
import { ExerciseInterfaceArray } from '../../services/models/API_Models';

export const getExercisesByLessonId = async (
  lessonId: number,
): Promise<ExerciseInterfaceArray> => {
  const res = await axiosClient.get(`/exercises/by-lesson/${lessonId}`);
  return Array.isArray(res) ? res : [];
};
