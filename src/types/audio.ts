export type Language = 'hi' | 'en' | 'bho';

export type AmbientKind = 'rain' | 'coffee' | 'air' | 'crowd';

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
