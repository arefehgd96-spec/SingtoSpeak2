import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SongCard from '@/components/cards/SongCard';
import { useTranslation } from '@/components/TranslationProvider';

export default function SpotlightSection({ songs, onSongClick }) {
  const { t } = useTranslation();
  if (!songs || songs.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-amber-400" />
        <h2 className="text-2xl font-bold text-white">{t('spotlight')}</h2>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
        {songs.slice(0, 6).map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <SongCard 
              song={song} 
              onClick={() => onSongClick(song.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}