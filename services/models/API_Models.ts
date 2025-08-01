export type SongInterfaceArray = SongInterface[];

export interface SongInterface {
  title: string;
  artist: string;
  level: string;
  sheet_url: string;
  video_id: string;
  id: number;
}

export interface UserInterface {
  username: string;
  email: string;
  avatar_url: string;
  id: number;
  created_at: string;
}

export type ProgressInterfaceArray = ProgressInterface[];

export interface ProgressInterface {
  user_id: number;
  lesson_id: number;
  completed: boolean;
  completed_at: string;
  id: number;
}

export type LessonInterfaceArray = LessonInterface[];

export interface LessonInterface {
  title: string;
  description: string;
  level: string;
  media_id: string;
  type: string;
  lesson_link: string;
  id: number;
}

export interface CreateProgressInterface {
  user_id: number
  lesson_id: number
  completed: boolean
  completed_at: string
}

export type ExerciseInterfaceArray = ExerciseInterface[]

export interface ExerciseInterface {
  lesson_id: number
  title: string
  type: string
  content: string
  id: number
}

export type PracticeRoomInterfaceArray = PracticeRoomInterface[]

export interface PracticeRoomInterface {
  room_name: string
  host_user_id: number
  instrument: string
  id: number
  created_at: string
}
