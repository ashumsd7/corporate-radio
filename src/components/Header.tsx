'use client';

import React, { useState, useEffect } from 'react';
import { Language } from '@/types/audio';
import { Volume2, VolumeX, CloudRain, ExternalLink } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isAmbientRainOn: boolean;
  onToggleAmbientRain: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isAmbientRainOn,
  onToggleAmbientRain,
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [listenerCount, setListenerCount] = useState<number>(41);

  // Update clock dynamically
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      setTimeString(`${hours}:${minutesStr} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Organic fluctuation in listener count for realistic feel
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
      setListenerCount((prev) => Math.max(28, Math.min(88, prev + delta)));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 pointer-events-none">
      {/* Top Left: Time Display */}
      <div className="pointer-events-auto flex items-baseline gap-2 text-white/90 drop-shadow-md">
        <span className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {timeString || '3:31 am'}
        </span>
      </div>

      {/* Top Right Controls & Badges */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        {/* Active Listeners Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-xs font-medium text-white/90 shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>{listenerCount} online</span>
        </div>

        {/* Ambient Rain Sound Toggle */}
        <button
          onClick={onToggleAmbientRain}
          title={isAmbientRainOn ? 'Turn off Rain Ambient' : 'Turn on Rain Ambient'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs font-medium transition-all duration-300 ${
            isAmbientRainOn
              ? 'bg-blue-600/40 text-blue-200 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
              : 'text-white/80 hover:text-white'
          }`}
        >
          <CloudRain className={`w-3.5 h-3.5 ${isAmbientRainOn ? 'animate-bounce text-blue-300' : ''}`} />
          <span className="hidden md:inline">{isAmbientRainOn ? 'Rain ON' : 'Rain'}</span>
        </button>

        {/* Platform Links (Spotify & YT Music badges inspired by reference screenshot) */}
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs text-emerald-300 hover:text-emerald-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.48-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.281 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.5.3z"/>
          </svg>
          <span>Spotify</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
        </a>

        <a
          href="https://music.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs text-red-300 hover:text-red-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.2c-3.978 0-7.2-3.222-7.2-7.2s3.222-7.2 7.2-7.2 7.2 3.222 7.2 7.2-3.222 7.2-7.2 7.2zm0-11.4c-2.316 0-4.2 1.884-4.2 4.2s1.884 4.2 4.2 4.2 4.2-1.884 4.2-4.2-1.884-4.2-4.2-4.2zm-1.2 6.12V10.08L14.4 12l-3.6 1.92z"/>
          </svg>
          <span>YT Music</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
        </a>

        {/* Language Switcher Pill */}
        <div className="flex items-center p-1 rounded-full glass-pill shadow-xl border border-white/20">
          <button
            onClick={() => onLanguageChange('hi')}
            className={`px-3 py-1 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 ${
              language === 'hi'
                ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-105'
                : 'text-white/70 hover:text-white'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 ${
              language === 'en'
                ? 'bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.6)] scale-105'
                : 'text-white/70 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </header>
  );
};
