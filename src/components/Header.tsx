'use client';

import React, { useEffect, useState } from 'react';
import { AmbientKind, Language } from '@/types/audio';
import { CloudRain, Coffee, Users, Wind } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  ambient: AmbientKind | null;
  onAmbientChange: (kind: AmbientKind | null) => void;
}

const AMBIENTS: { id: AmbientKind; label: string; icon: typeof CloudRain }[] = [
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'coffee', label: 'Cafe', icon: Coffee },
  { id: 'air', label: 'Air', icon: Wind },
  { id: 'crowd', label: 'Crowd', icon: Users },
];

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  ambient,
  onAmbientChange,
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
    <header className="fixed top-0 left-0 right-0 z-40 flex items-start sm:items-center justify-between gap-2 px-2.5 sm:px-8 py-3 sm:py-6 pointer-events-none">
      <div className="pointer-events-auto flex items-baseline gap-2 text-[#3f2f1e] shrink-0">
        <span className="font-cinzel text-xl sm:text-4xl md:text-5xl font-bold tracking-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.35)]">
          {timeString || '3:31 am'}
        </span>
      </div>

      <div className="pointer-events-auto flex items-center justify-end gap-1 sm:gap-3 flex-wrap max-w-[72%] sm:max-w-none">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full khaki-pill text-xs font-medium text-[#3f2f1e] shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
          </span>
          <span>{listenerCount} online</span>
        </div>

        <div className="flex items-center gap-0.5 p-1 rounded-full khaki-pill shadow-sm">
          {AMBIENTS.map(({ id, label, icon: Icon }) => {
            const active = ambient === id;
            return (
              <button
                key={id}
                type="button"
                title={active ? `Turn off ${label}` : label}
                onClick={() => onAmbientChange(active ? null : id)}
                className={`flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:gap-1 sm:px-2.5 sm:py-1 rounded-full text-[11px] font-medium transition-all duration-300 ${
                  active
                    ? 'bg-[#4b3b2a] text-[#f4e6c3] shadow-[0_0_10px_rgba(75,59,42,0.28)]'
                    : 'text-[#5c4630] hover:text-[#2a1e12]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#f4e6c3]' : ''}`} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center p-1 rounded-full khaki-pill shadow-sm">
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-2 sm:px-3 py-1 text-[11px] sm:text-sm font-bold rounded-full transition-all duration-300 ${
              language === 'hi'
                ? 'bg-[#c45c26] text-white shadow-[0_0_12px_rgba(196,92,38,0.35)] scale-105'
                : 'text-[#5c4630] hover:text-[#2a1e12]'
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('bho')}
            className={`px-2 sm:px-3 py-1 text-[11px] sm:text-sm font-bold rounded-full transition-all duration-300 ${
              language === 'bho'
                ? 'bg-[#7a4a1e] text-[#f4e6c3] shadow-[0_0_12px_rgba(122,74,30,0.35)] scale-105'
                : 'text-[#5c4630] hover:text-[#2a1e12]'
            }`}
          >
            <span className="sm:hidden">भोज</span>
            <span className="hidden sm:inline">भोजपुरी</span>
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2 sm:px-3 py-1 text-[11px] sm:text-sm font-bold rounded-full transition-all duration-300 ${
              language === 'en'
                ? 'bg-[#4b3b2a] text-[#f4e6c3] shadow-[0_0_12px_rgba(75,59,42,0.35)] scale-105'
                : 'text-[#5c4630] hover:text-[#2a1e12]'
            }`}
          >
            Eng
          </button>
        </div>
      </div>
    </header>
  );
};
