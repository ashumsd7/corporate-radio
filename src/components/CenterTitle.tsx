'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/types/audio';

interface CenterTitleProps {
  language: Language;
}

export const CenterTitle: React.FC<CenterTitleProps> = ({ language }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 select-none my-auto">
      <AnimatePresence mode="wait">
        {language === 'hi' ? (
          <motion.div
            key="hindi-title"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {/* Retro Vintage Signboard Title (like Dealux Saloon / dealux saloon) */}
            <div className="signboard-title flex flex-col items-center tracking-wide leading-none text-amber-50">
              <span className="text-5xl sm:text-7xl md:text-8xl font-black drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] bg-clip-text text-transparent bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400">
                कॉर्पोरेट
              </span>
              <span className="text-4xl sm:text-6xl md:text-7xl font-black mt-1 sm:mt-3 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] text-white">
                मजदूर का बाजा
              </span>
            </div>

            {/* Subtitle tag */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 sm:mt-6 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/30 text-amber-200/90 text-xs sm:text-sm font-medium tracking-wide shadow-2xl"
            >
              ओवरटाइम और डेडलाइन से राहत का इकलौता ठिकाना ☕✨
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="english-title"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {/* Sleek Retro English Title */}
            <div className="english-title flex flex-col items-center tracking-widest leading-none">
              <span className="text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                Corporate
              </span>
              <span className="text-4xl sm:text-6xl md:text-7xl font-bold mt-1 sm:mt-2 text-amber-400 tracking-wider drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
                Radio
              </span>
            </div>

            {/* English Subtitle Tag */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 sm:mt-6 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-slate-200 text-xs sm:text-sm font-medium tracking-wider shadow-2xl"
            >
              Soothing Beats for Overworked Souls 📻 🎧
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
