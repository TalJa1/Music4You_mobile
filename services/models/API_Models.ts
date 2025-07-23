export type SongInterfaceArray = SongInterface[]

export interface SongInterface {
  title: string
  artist: string
  level: string
  sheet_url: string
  video_id: string
  id: number
}

export interface UserInterface {
  username: string
  email: string
  avatar_url: string
  id: number
  created_at: string
}

export type ProgressInterfaceArray = ProgressInterface[]

export interface ProgressInterface {
  user_id: number
  lesson_id: number
  completed: boolean
  completed_at: string
  id: number
}
