export type Language = 'hi' | 'en';

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl: string;
  youtubeId?: string;
  duration: number; // in seconds
  language: Language;
  genre: string;
  quote?: string;
}
