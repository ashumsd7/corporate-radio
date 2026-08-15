'use client';

import React, { useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { CenterTitle } from '@/components/CenterTitle';
import { Player } from '@/components/Player';
import { PlaylistDrawer } from '@/components/PlaylistDrawer';
import { AmbientBed } from '@/components/AmbientBed';
import { Footer } from '@/components/Footer';
import { getPlaylist } from '@/data/songs';
import { AmbientKind, Language, Song } from '@/types/audio';

export default function Home() {
  const [language, setLanguage] = useState<Language>('hi');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [ambient, setAmbient] = useState<AmbientKind | null>(null);

  const activePlaylist = useMemo(() => getPlaylist(language), [language]);
  const currentSong = activePlaylist[currentSongIndex] || activePlaylist[0];

  const handleLanguageChange = (lang: Language) => {
    if (lang === language) return;
    setLanguage(lang);
    setCurrentSongIndex(0);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % activePlaylist.length);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + activePlaylist.length) % activePlaylist.length);
    setIsPlaying(true);
  };

  const handleSelectSong = (song: Song) => {
    const index = activePlaylist.findIndex((item) => item.id === song.id);
    if (index === -1) return;
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none khaki-stage">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        ambient={ambient}
        onAmbientChange={setAmbient}
      />

      <CenterTitle language={language} />

      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNextSong}
        onPrev={handlePrevSong}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        language={language}
      />

      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        playlist={activePlaylist}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onSelectSong={handleSelectSong}
        language={language}
      />

      <AmbientBed kind={ambient} volume={0.2} />
      <Footer />
    </main>
  );
}
