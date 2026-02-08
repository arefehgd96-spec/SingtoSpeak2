import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SongCard from '@/components/cards/SongCard';
import { useTranslation } from '@/components/TranslationProvider';

export default function SimilarSongs({ currentSong }) {
  const { t } = useTranslation();
  const { data: songs = [] } = useQuery({
    queryKey: ['songs'],
    queryFn: () => base44.entities.Song.list('-created_date', 50)
  });

  const similarSongs = songs
    .filter(song => 
      song.id !== currentSong.id &&
      (song.language === currentSong.language || 
       song.genre === currentSong.genre ||
       song.difficulty === currentSong.difficulty)
    )
    .slice(0, 4);

  if (similarSongs.length === 0) return null;

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {t('similarSongs')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {similarSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              variant="compact"
              onClick={() => window.location.href = createPageUrl('Player') + `?songId=${song.id}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}