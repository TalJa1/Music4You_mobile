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
