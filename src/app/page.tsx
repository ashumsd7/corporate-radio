'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CenterTitle } from '@/components/CenterTitle';
import { Player } from '@/components/Player';
import { PlaylistDrawer } from '@/components/PlaylistDrawer';
import { AmbientRain } from '@/components/AmbientRain';
import { Footer } from '@/components/Footer';
import { HINDI_SONGS, ENGLISH_SONGS, getPlaylist } from '@/data/songs';
import { Language, Song } from '@/types/audio';

export default function Home() {
  const [language, setLanguage] = useState<Language>('hi');
  const [activePlaylist, setActivePlaylist] = useState<Song[]>(HINDI_SONGS);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);
  const [isAmbientRainOn, setIsAmbientRainOn] = useState<boolean>(false);

  // Sync active playlist when language changes
  useEffect(() => {
    const newPlaylist = getPlaylist(language);
    setActivePlaylist(newPlaylist);
    setCurrentSongIndex(0);
  }, [language]);

  const currentSong = activePlaylist[currentSongIndex] || activePlaylist[0];

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
    const index = activePlaylist.findIndex((s) => s.id === song.id);
    if (index !== -1) {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none">
      {/* 100vh 100vw Background Image requested by user */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://i.ibb.co/WWWc5S7C/radio.png"
          alt="Corporate Radio Background"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        />
        {/* Soft Vignette and Warm Tint Overlay for ideal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-amber-950/10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Header: Clock, Listeners & Language Switch */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        isAmbientRainOn={isAmbientRainOn}
        onToggleAmbientRain={() => setIsAmbientRainOn((prev) => !prev)}
      />

      {/* Center Animated Title */}
      <CenterTitle language={language} />

      {/* Audio Player Widget */}
      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNextSong}
        onPrev={handlePrevSong}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        language={language}
      />

      {/* Slide-over Playlist Drawer */}
      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        playlist={activePlaylist}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onSelectSong={handleSelectSong}
        language={language}
      />

      {/* Procedural Rain Sound Generator */}
      <AmbientRain isPlaying={isAmbientRainOn} volume={0.2} />

      {/* Footer Credit */}
      <Footer />
    </main>
  );
}
