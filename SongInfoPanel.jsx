import React from 'react';
import { Music, Guitar, Users, BookOpen, Target } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/components/TranslationProvider';

export default function SongInfoPanel({ song }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {/* Artist & Composer */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('artistsComposers')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-zinc-500 text-xs">{t('artist')}</p>
            <p className="text-white">{song.artist}</p>
          </div>
          {song.composer && (
            <div>
              <p className="text-zinc-500 text-xs">{t('composer')}</p>
              <p className="text-white">{song.composer}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Genre & Instruments */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Music className="h-4 w-4" />
            {t('musicalDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {song.genre && (
            <div>
              <p className="text-zinc-500 text-xs mb-1">{t('genre')}</p>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 capitalize">
                {song.genre}
              </Badge>
            </div>
          )}
          {song.instruments?.length > 0 && (
            <div>
              <p className="text-zinc-500 text-xs mb-2">{t('instruments')}</p>
              <div className="flex flex-wrap gap-2">
                {song.instruments.map((instrument, idx) => (
                  <Badge key={idx} variant="outline" className="text-zinc-400 border-zinc-700">
                    {instrument}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grammar & Level */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t('learningDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-zinc-500 text-xs mb-1">{t('difficultyLevel')}</p>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 capitalize">
              {t(song.difficulty)}
            </Badge>
          </div>
          {song.cefr_level && (
            <div>
              <p className="text-zinc-500 text-xs mb-1">{t('cefrLevel')}</p>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {song.cefr_level}
              </Badge>
            </div>
          )}
          {song.grammar_topics?.length > 0 && (
            <div>
              <p className="text-zinc-500 text-xs mb-2">{t('grammarTopics')}</p>
              <div className="flex flex-wrap gap-2">
                {song.grammar_topics.map((topic, idx) => (
                  <Badge key={idx} variant="outline" className="text-zinc-400 border-zinc-700">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}