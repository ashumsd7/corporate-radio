'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Song, Language } from '@/types/audio';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Shuffle,
  Repeat,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenPlaylist: () => void;
  language: Language;
}

export const Player: React.FC<PlayerProps> = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onOpenPlaylist,
  language,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(currentSong.duration || 180);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // Sync audio source & state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.log('Autoplay prevented or network delay:', err);
        });
      }
    }
  }, [currentSong]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Play error:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Format time (mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      onNext();
    }
  };

  const triggerChillConfetti = () => {
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#f59e0b', '#6366f1', '#10b981', '#ec4899'],
    });
  };

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-xl">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.duration) {
              setDuration(audioRef.current.duration);
            }
          }
        }}
        onEnded={handleEnded}
        onError={() => {
          console.warn('Primary audio stream failed, auto-advancing to next track.');
          setTimeout(onNext, 1000);
        }}
      />

      {/* Main Glassmorphic Player Card */}
      <div className="glass-panel rounded-full p-2.5 sm:p-3 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300">
        <div className="flex items-center gap-3 sm:gap-4 justify-between">
          
          {/* Left: Album Artwork with Vinyl spin effect */}
          <div
            onClick={onOpenPlaylist}
            className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-white/20 shadow-md cursor-pointer group"
          >
            <img
              src={currentSong.albumArt}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
              }`}
            />
            {/* Center Vinyl Hole Accent */}
            <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-black/80 border border-white/40 group-hover:scale-125 transition-transform" />
          </div>

          {/* Center: Song Info & Progress Slider */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* Title and Artist */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="min-w-0 pr-2">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate tracking-wide">
                  {currentSong.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-white/60 truncate">
                  {currentSong.artist}
                </p>
              </div>

              {/* Timestamp Indicator */}
              <div className="text-[10px] sm:text-xs text-white/50 font-mono flex-shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative flex items-center group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Right: Audio Control Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Previous Track */}
            <button
              onClick={onPrev}
              title="Previous Track"
              className="p-1.5 sm:p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            {/* Play/Pause Main Button */}
            <button
              onClick={onPlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={onNext}
              title="Next Track"
              className="p-1.5 sm:p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            {/* Playlist Drawer Button */}
            <button
              onClick={onOpenPlaylist}
              title="View Playlist"
              className="p-2 rounded-full glass-pill text-amber-300 hover:text-amber-200 hover:bg-white/15 transition-all"
            >
              <ListMusic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
