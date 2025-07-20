import axiosClient from '../axiosClient';
import {
  SongInterface,
  SongInterfaceArray,
} from '../../services/models/API_Models';

// Get all songs
export const getSongs = async (): Promise<SongInterfaceArray> => {
  return await axiosClient.get('/songs');
};

// Get a single song by ID
export const getSongById = async (id: number): Promise<SongInterface> => {
  return await axiosClient.get(`/songs/${id}`);
};

// Create a new song
export const createSong = async (
  song: Omit<SongInterface, 'id'>,
): Promise<SongInterface> => {
  return await axiosClient.post('/songs', song);
};

// Update a song by ID
export const updateSong = async (
  id: number,
  song: Partial<Omit<SongInterface, 'id'>>,
): Promise<SongInterface> => {
  return await axiosClient.put(`/songs/${id}`, song);
};

// Delete a song by ID
export const deleteSong = async (id: number): Promise<void> => {
  await axiosClient.delete(`/songs/${id}`);
};
