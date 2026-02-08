import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTranslation } from '@/components/TranslationProvider';

export default function PlaylistCard({ playlist, onClick, variant = 'default' }) {
  const { t } = useTranslation();
  const languageFlags = {
    german: '🇩🇪',
    english: '🇬🇧',
    mixed: '🌍'
  };

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative rounded-3xl overflow-hidden cursor-pointer group h-48 md:h-56"
      >
        {playlist.cover_image ? (
          <img 
            src={playlist.cover_image} 
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-700 via-green-800 to-green-900" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{languageFlags[playlist.language]}</span>
            {playlist.difficulty && playlist.difficulty !== 'mixed' && (
              <span className="text-xs uppercase tracking-wider text-zinc-400">{t(playlist.difficulty)}</span>
            )}
          </div>
          <h3 className="text-white text-xl md:text-2xl font-bold mb-1">{playlist.name}</h3>
          {playlist.description && (
            <p className="text-zinc-300 text-xs line-clamp-1">{playlist.description}</p>
          )}
          <p className="text-zinc-500 text-xs mt-1">
            {playlist.song_ids?.length || 0} {t('songs_plural')}
          </p>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
            <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
        {playlist.cover_image ? (
          <img 
            src={playlist.cover_image} 
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-700 via-green-800 to-green-900" />
        )}
        
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <span className="text-2xl drop-shadow-lg">{languageFlags[playlist.language]}</span>
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-white font-medium text-sm truncate">{playlist.name}</h3>
        <p className="text-zinc-500 text-xs">
          {playlist.song_ids?.length || 0} {t('songs_plural')}
        </p>
      </div>
    </motion.div>
  );
}