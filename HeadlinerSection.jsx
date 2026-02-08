import React from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from '@/components/TranslationProvider';

export default function HeadlinerSection({ song, onPlay }) {
  const { t } = useTranslation();
  if (!song) return null;

  const difficultyColors = {
    beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    intermediate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    advanced: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-[300px] rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 mb-8"
    >
      {/* Background Image */}
      {song.cover_image && (
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center blur-sm scale-110"
          style={{ backgroundImage: `url(${song.cover_image})` }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 lg:p-12">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider">
            {t('headliner')}
          </span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          {song.title}
        </h1>
        
        <p className="text-base text-zinc-300 mb-3">{song.artist}</p>

        <div className="flex items-center gap-3 mb-6">
          <Badge variant="outline" className={cn("text-sm", difficultyColors[song.difficulty])}>
            {t(song.difficulty)}
          </Badge>
          <span className="text-3xl">
            {song.language === 'german' ? '🇩🇪' : '🇬🇧'}
          </span>
          {song.genre && (
            <Badge variant="outline" className="text-zinc-400 border-zinc-700 capitalize">
              {song.genre}
            </Badge>
          )}
        </div>

        <Button
          onClick={onPlay}
          size="lg"
          className="w-fit bg-white hover:bg-zinc-200 text-black font-medium"
        >
          <Play className="h-5 w-5 mr-2 fill-black" />
          {t('playNow')}
        </Button>
      </div>
    </motion.div>
  );
}