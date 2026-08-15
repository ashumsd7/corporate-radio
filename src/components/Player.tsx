'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Song, Language } from '@/types/audio';
import { Play, Pause, SkipBack, SkipForward, ListMusic } from 'lucide-react';

interface PlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenPlaylist: () => void;
  language: Language;
}

const YT_PLAYING = 1;
const YT_ENDED = 0;

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (!document.getElementById('corporate-radio-yt-api')) {
      const tag = document.createElement('script');
      tag.id = 'corporate-radio-yt-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    if (window.YT?.Player) resolve();
  });

  return youtubeApiPromise;
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
  const playerRef = useRef<YT.Player | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const onNextRef = useRef(onNext);
  const currentIdRef = useRef(currentSong.youtubeId);
  const consecutiveErrorsRef = useRef(0);
  const hasLoadedInitialRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentSong.duration || 180);
  const [isReady, setIsReady] = useState(false);

  isPlayingRef.current = isPlaying;
  onNextRef.current = onNext;
  currentIdRef.current = currentSong.youtubeId;

  useEffect(() => {
    let cancelled = false;

    const createPlayer = async () => {
      await loadYouTubeApi();
      if (cancelled || playerRef.current || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player('corporate-radio-yt', {
        width: 200,
        height: 113,
        videoId: currentIdRef.current,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(82);
            const nextDuration = event.target.getDuration();
            if (nextDuration) setDuration(nextDuration);
            setIsReady(true);
            if (isPlayingRef.current) event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === YT_PLAYING) {
              consecutiveErrorsRef.current = 0;
              const nextDuration = event.target.getDuration();
              if (nextDuration) setDuration(nextDuration);
            }
            if (event.data === YT_ENDED) {
              onNextRef.current();
            }
          },
          onError: () => {
            consecutiveErrorsRef.current += 1;
            if (consecutiveErrorsRef.current <= 22) {
              window.setTimeout(() => onNextRef.current(), 600);
            }
          },
        },
      });
    };

    createPlayer();

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!isReady || !player?.cueVideoById) return;

    if (!hasLoadedInitialRef.current) {
      hasLoadedInitialRef.current = true;
      return;
    }

    setCurrentTime(0);
    setDuration(currentSong.duration || 180);

    if (isPlayingRef.current) {
      player.loadVideoById(currentSong.youtubeId);
    } else {
      player.cueVideoById(currentSong.youtubeId);
    }
  }, [currentSong.id, currentSong.youtubeId, currentSong.duration, isReady]);

  useEffect(() => {
    const player = playerRef.current;
    if (!isReady || !player?.playVideo) return;

    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (!isReady) return;

    const timer = window.setInterval(() => {
      const player = playerRef.current;
      if (!player?.getCurrentTime) return;
      const time = player.getCurrentTime();
      const length = player.getDuration();
      if (Number.isFinite(time)) setCurrentTime(time);
      if (Number.isFinite(length) && length > 0) setDuration(length);
    }, 250);

    return () => window.clearInterval(timer);
  }, [isReady]);

  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    playerRef.current?.seekTo(newTime, true);
  };

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-xl">
      <div
        className="pointer-events-none fixed left-3 bottom-3 z-0 h-[113px] w-[200px] overflow-hidden opacity-[0.02]"
        aria-hidden
      >
        <div id="corporate-radio-yt" />
      </div>

      <div className="glass-panel rounded-full p-2.5 sm:p-3 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300">
        <div className="flex items-center gap-3 sm:gap-4 justify-between">
          <button
            type="button"
            onClick={onOpenPlaylist}
            className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-white/20 shadow-md cursor-pointer group"
            title={language === 'en' ? 'Open playlist' : 'प्लेलिस्ट खोलें'}
          >
            <img
              src={currentSong.albumArt}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-500 animate-spin-slow ${
                isPlaying ? '' : 'animate-spin-paused'
              }`}
            />
            <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-black/80 border border-white/40 group-hover:scale-125 transition-transform" />
          </button>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="min-w-0 pr-2">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate tracking-wide">
                  {currentSong.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-white/60 truncate">
                  {currentSong.artist}
                </p>
              </div>
              <div className="text-[10px] sm:text-xs text-white/50 font-mono flex-shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="relative flex items-center group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.25}
                value={Math.min(currentTime, duration || 100)}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onPrev}
              title="Previous Track"
              className="p-1.5 sm:p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            <button
              type="button"
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

            <button
              type="button"
              onClick={onNext}
              title="Next Track"
              className="p-1.5 sm:p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            <button
              type="button"
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
