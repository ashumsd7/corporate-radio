'use client';

import React, { useEffect, useState } from 'react';
import { Language } from '@/types/audio';
import { CloudRain } from 'lucide-react';

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
  const [timeString, setTimeString] = useState('');
  const [listenerCount, setListenerCount] = useState(41);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? `0${minutes}` : String(minutes);
      setTimeString(`${hours}:${minutesStr} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 3) - 1;
      setListenerCount((prev) => Math.max(28, Math.min(88, prev + delta)));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 pointer-events-none">
      <div className="pointer-events-auto flex items-baseline gap-2 text-[#3f2f1e]">
        <span className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.35)]">
          {timeString || '3:31 am'}
        </span>
      </div>

      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full khaki-pill text-xs font-medium text-[#3f2f1e] shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
          </span>
          <span>{listenerCount} online</span>
        </div>

        <button
          type="button"
          onClick={onToggleAmbientRain}
          title={isAmbientRainOn ? 'Turn off rain' : 'Turn on rain'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full khaki-pill text-xs font-medium transition-all duration-300 ${
            isAmbientRainOn
              ? 'bg-sky-700/20 text-sky-900 border-sky-700/30 shadow-[0_0_12px_rgba(12,74,110,0.18)]'
              : 'text-[#3f2f1e] hover:text-[#2a1e12]'
          }`}
        >
          <CloudRain className={`w-3.5 h-3.5 ${isAmbientRainOn ? 'animate-bounce text-sky-800' : ''}`} />
          <span className="hidden md:inline">{isAmbientRainOn ? 'Rain ON' : 'Rain'}</span>
        </button>

        <div className="flex items-center p-1 rounded-full khaki-pill shadow-sm">
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-3 py-1 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 ${
              language === 'hi'
                ? 'bg-[#c45c26] text-white shadow-[0_0_12px_rgba(196,92,38,0.35)] scale-105'
                : 'text-[#5c4630] hover:text-[#2a1e12]'
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 ${
              language === 'en'
                ? 'bg-[#4b3b2a] text-[#f4e6c3] shadow-[0_0_12px_rgba(75,59,42,0.35)] scale-105'
                : 'text-[#5c4630] hover:text-[#2a1e12]'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </header>
  );
};
