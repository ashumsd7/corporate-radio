'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/types/audio';

interface CenterTitleProps {
  language: Language;
}

const PORTRAIT_SRC = 'https://i.ibb.co/nsx2dGJ3/majdoor-but-proud.jpg';

function MajdoorPortrait() {
  return (
    <div className="majdoor-blend mb-6 sm:mb-8 md:mb-10 animate-pulse" aria-hidden>
      <img src={PORTRAIT_SRC} alt="" />
    </div>
  );
}

export const CenterTitle: React.FC<CenterTitleProps> = ({ language }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 select-none my-auto pt-16 sm:pt-20 pb-28">
      <MajdoorPortrait />
      <AnimatePresence mode="wait">
        {language === 'hi' ? (
          <motion.div
            key="hindi-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="signboard-title flex flex-col items-center tracking-wide leading-none text-[#3b2716]">
              <span className="text-4xl sm:text-6xl md:text-8xl font-black">
                कॉर्पोरेट
              </span>
              <span className="text-3xl sm:text-5xl md:text-7xl font-black mt-1 sm:mt-2 text-[#6b3a1f]">
                मजदूर का बाजा
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-3 sm:mt-5 px-4 py-1.5 rounded-full khaki-pill text-[#4a341f] text-xs sm:text-sm font-medium tracking-wide shadow-sm"
            >
              ओवरटाइम और डेडलाइन से राहत का इकलौता ठिकाना ☕
            </motion.div>
          </motion.div>
        ) : language === 'bho' ? (
          <motion.div
            key="bhojpuri-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="signboard-title flex flex-col items-center tracking-wide leading-none text-[#3b2716]">
              <span className="text-4xl sm:text-6xl md:text-8xl font-black">
                कॉर्पोरेट
              </span>
              <span className="text-3xl sm:text-5xl md:text-7xl font-black mt-1 sm:mt-2 text-[#6b3a1f]">
                मजदूर के बाजा
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-3 sm:mt-5 px-4 py-1.5 rounded-full khaki-pill text-[#4a341f] text-xs sm:text-sm font-medium tracking-wide shadow-sm"
            >
              ऑफिस के थकान मिटावे वाला भोजपुरी सुकून 🌾
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="english-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="english-title flex flex-col items-center tracking-widest leading-none">
              <span className="text-4xl sm:text-6xl md:text-8xl font-extrabold uppercase text-[#3b2716]">
                Corporate
              </span>
              <span className="text-3xl sm:text-5xl md:text-7xl font-bold mt-1 sm:mt-2 text-[#8a4b22] tracking-wider">
                Majdoor
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-3 sm:mt-5 px-4 py-1.5 rounded-full khaki-pill text-[#4a341f] text-xs sm:text-sm font-medium tracking-wider shadow-sm"
            >
              Soothing beats for overworked souls 📻
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
