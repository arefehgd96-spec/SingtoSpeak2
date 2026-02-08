import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Heart, Music } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import SongCard from '@/components/cards/SongCard';
import { useTranslation } from '@/components/TranslationProvider';

export default function Favorites() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {}
    };
    loadUser();
  }, []);

  const { data: progress = [], isLoading: progressLoading } = useQuery({
    queryKey: ['progress', 'favorites'],
    queryFn: () => base44.entities.UserProgress.filter({ 
      favorite: true,
      created_by: user?.email 
    }),
    enabled: !!user
  });

  const { data: songs = [], isLoading: songsLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: () => base44.entities.Song.list('-created_date', 100)
  });

  const favoriteSongs = progress
    .map(p => songs.find(s => s.id === p.song_id))
    .filter(Boolean);

  const isLoading = progressLoading || songsLoading;

  return (
    <div className="min-h-screen px-6 lg:px-12 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-white text-3xl font-bold">{t('favoritesTitle')}</h1>
            <p className="text-zinc-400">{t('songsYouLiked')}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-2xl bg-zinc-800" />
              <Skeleton className="h-4 w-3/4 bg-zinc-800" />
              <Skeleton className="h-3 w-1/2 bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : favoriteSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-zinc-600" />
          </div>
          <h3 className="text-white text-lg font-medium mb-2">{t('noFavoritesYet')}</h3>
          <p className="text-zinc-500 max-w-md">
            {t('startListeningFavorites')}
          </p>
        </div>
      ) : (
        <>
          <p className="text-zinc-500 text-sm mb-6">{favoriteSongs.length} {t('songs_plural')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favoriteSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
              >
                <SongCard
                  song={song}
                  isFavorite={true}
                  onClick={() => window.location.href = createPageUrl('Player') + `?songId=${song.id}`}
                />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}