'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song, Language } from '@/types/audio';
import { X, Play, Music, Search, Disc } from 'lucide-react';

interface PlaylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Song[];
  currentSong: Song;
  isPlaying: boolean;
  onSelectSong: (song: Song) => void;
  language: Language;
}

export const PlaylistDrawer: React.FC<PlaylistDrawerProps> = ({
  isOpen,
  onClose,
  playlist,
  currentSong,
  isPlaying,
  onSelectSong,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaylist = playlist.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto h-[80vh] max-h-[600px] glass-panel rounded-t-3xl border-t border-white/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  <Disc className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {language === 'hi' ? 'धीमे हिंदी गाने' : 'Slow English songs'}
                  </h3>
                  <p className="text-xs text-white/60">
                    {playlist.length} {language === 'hi' ? 'सुकून भरे गाने' : 'soothing tracks'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-6 py-3 bg-black/20 border-b border-white/5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'गाना या आर्टिस्ट खोजें...' : 'Search title, artist or mood...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 text-sm text-white placeholder-white/40 pl-10 pr-4 py-2 rounded-full border border-white/10 focus:outline-none focus:border-amber-400/60 transition-all"
                />
              </div>
            </div>

            {/* Song List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-white/5">
              {filteredPlaylist.map((song, index) => {
                const isSelected = currentSong.id === song.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => {
                      onSelectSong(song);
                      onClose();
                    }}
                    className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-500/30 text-white shadow-lg'
                        : 'hover:bg-white/5 text-white/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <span className="w-6 text-center text-xs font-semibold text-white/40 group-hover:text-amber-400">
                        {index + 1}
                      </span>

                      {/* Song Art */}
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-md">
                        <img
                          src={song.albumArt}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && isPlaying && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex items-end gap-0.5 h-4">
                              <span className="w-1 bg-amber-400 animate-bounce h-full rounded-full" />
                              <span className="w-1 bg-amber-400 animate-bounce h-2/3 rounded-full delay-100" />
                              <span className="w-1 bg-amber-400 animate-bounce h-4/5 rounded-full delay-200" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Song Info */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold truncate group-hover:text-amber-300 transition-colors">
                            {song.title}
                          </h4>
                          {isSelected && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold uppercase tracking-wider">
                              Playing
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/50 truncate">{song.artist}</p>
                        {song.quote && (
                          <p className="text-[11px] text-amber-200/70 italic truncate mt-0.5">
                            &ldquo;{song.quote}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Duration & Play Icon */}
                    <div className="flex items-center gap-3 flex-shrink-0 pl-2">
                      <span className="text-xs text-white/40 font-mono">
                        {formatTime(song.duration)}
                      </span>
                      <button className="p-2 rounded-full bg-white/10 group-hover:bg-amber-500 group-hover:text-black text-white/80 transition-all">
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredPlaylist.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  <Music className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No songs match your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
