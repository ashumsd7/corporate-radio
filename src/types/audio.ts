export type Language = 'hi' | 'en';

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  youtubeId: string;
  duration: number;
  language: Language;
  genre: string;
  quote?: string;
}
