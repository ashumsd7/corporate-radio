'use client';

import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-3 left-0 right-0 z-30 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full khaki-pill text-xs text-[#4a341f] shadow-sm hover:border-[#8a4b22]/40 transition-all duration-300 group">
        <span>Built with</span>
        <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
        <span>by</span>
        <a
          href="https://heyashu.in"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#8a4b22] hover:text-[#6b3a1f] underline decoration-[#8a4b22]/50 hover:decoration-[#6b3a1f] flex items-center gap-1 transition-colors"
        >
          heyashu.in
          <ExternalLink className="w-3 h-3 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </footer>
  );
};
