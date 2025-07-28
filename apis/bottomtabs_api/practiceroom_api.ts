
import axiosClient from '../axiosClient';
import { PracticeRoomInterface, PracticeRoomInterfaceArray } from '../../services/models/API_Models';

// Get all practice rooms
export const getPracticeRooms = async (): Promise<PracticeRoomInterfaceArray> => {
  return await axiosClient.get('/practice-rooms');
};

// Get a practice room by ID
export const getPracticeRoomById = async (id: number): Promise<PracticeRoomInterface> => {
  return await axiosClient.get(`/practice-rooms/${id}`);
};

// Create a new practice room
export const createPracticeRoom = async (room: Omit<PracticeRoomInterface, 'id' | 'created_at'>): Promise<PracticeRoomInterface> => {
  return await axiosClient.post('/practice-rooms', room);
};

// Update a practice room by ID
export const updatePracticeRoom = async (id: number, room: Partial<Omit<PracticeRoomInterface, 'id' | 'created_at'>>): Promise<PracticeRoomInterface> => {
  return await axiosClient.put(`/practice-rooms/${id}`, room);
};

// Delete a practice room by ID
export const deletePracticeRoom = async (id: number): Promise<void> => {
  await axiosClient.delete(`/practice-rooms/${id}`);
};

// Get practice rooms by instrument
export const getPracticeRoomsByInstrument = async (instrument: string): Promise<PracticeRoomInterfaceArray> => {
  return await axiosClient.get(`/practice-rooms/by-instrument/${encodeURIComponent(instrument)}`);
};
