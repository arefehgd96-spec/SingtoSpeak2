import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, TrendingUp, BookOpen, Target, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SongCard from '@/components/cards/SongCard';
import { createPageUrl } from '@/utils';
import { useTranslation } from '@/components/TranslationProvider';

export default function PersonalizedRecommendations({ user }) {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: progress = [] } = useQuery({
    queryKey: ['user-progress', user?.email],
    queryFn: () => base44.entities.UserProgress.filter({ created_by: user.email }),
    enabled: !!user
  });

  const { data: completions = [] } = useQuery({
    queryKey: ['exercise-completions', user?.email],
    queryFn: () => base44.entities.ExerciseCompletion.filter({ created_by: user.email }),
    enabled: !!user
  });

  const { data: songs = [] } = useQuery({
    queryKey: ['songs'],
    queryFn: () => base44.entities.Song.list('-created_date', 100)
  });

  useEffect(() => {
    const generateRecommendations = async () => {
      if (!user || !songs.length) return;

      try {
        const learnedWords = progress.flatMap(p => p.learned_words || []);
        const completedExercises = completions.length;
        const favoriteSongs = progress.filter(p => p.favorite).map(p => p.song_id);
        const playedLanguages = [...new Set(progress.map(p => {
          const song = songs.find(s => s.id === p.song_id);
          return song?.language;
        }).filter(Boolean))];

        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze this user's language learning progress and provide personalized recommendations:

User Stats:
- Learned words: ${learnedWords.length}
- Completed exercises: ${completedExercises}
- Favorite songs: ${favoriteSongs.length}
- Languages practiced: ${playedLanguages.join(', ')}
- Sample learned words: ${learnedWords.slice(0, 20).join(', ')}

Available songs: ${JSON.stringify(songs.map(s => ({ 
  id: s.id, 
  title: s.title, 
  difficulty: s.difficulty, 
  language: s.language,
  genre: s.genre,
  grammar_topics: s.grammar_topics,
  cefr_level: s.cefr_level
})))}

Provide:
1. Next 3 recommended songs (with IDs from available songs)
2. Vocabulary topics to focus on (5 topics)
3. Grammar topics to learn next (5 topics)
4. Current estimated level (A1-C2)
5. Learning path steps (5 concrete next steps)`,
          response_json_schema: {
            type: "object",
            properties: {
              recommended_songs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    song_id: { type: "string" },
                    reason: { type: "string" }
                  }
                }
              },
              vocabulary_topics: {
                type: "array",
                items: { type: "string" }
              },
              grammar_topics: {
                type: "array",
                items: { type: "string" }
              },
              current_level: { type: "string" },
              learning_path: {
                type: "array",
                items: { type: "string" }
              }
            }
          }
        });

        setRecommendations(result);
      } catch (error) {
        console.error('Failed to generate recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [user, progress, completions, songs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!recommendations) return null;

  const recommendedSongObjects = recommendations.recommended_songs
    ?.map(rec => ({
      song: songs.find(s => s.id === rec.song_id),
      reason: rec.reason
    }))
    .filter(rec => rec.song);

  return (
    <div className="space-y-6">
      {/* Current Level */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t('yourCurrentLevel')}</p>
              <h3 className="text-foreground text-2xl font-bold">{recommendations.current_level}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Songs */}
      {recommendedSongObjects?.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              {t('recommendedForYou')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedSongObjects.map(({ song, reason }, idx) => (
              <div key={idx}>
                <SongCard
                  song={song}
                  variant="compact"
                  onClick={() => window.location.href = createPageUrl('Player') + `?songId=${song.id}`}
                />
                <p className="text-muted-foreground text-xs mt-1 ml-16">{reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Vocabulary Topics */}
      {recommendations.vocabulary_topics?.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {t('vocabularyToLearn')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recommendations.vocabulary_topics.map((topic, idx) => (
                <Badge key={idx} className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grammar Topics */}
      {recommendations.grammar_topics?.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              {t('grammarToFocusOn')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recommendations.grammar_topics.map((topic, idx) => (
                <Badge key={idx} className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Path */}
      {recommendations.learning_path?.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              {t('yourLearningPath')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {recommendations.learning_path.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm font-medium">
                    {idx + 1}
                  </span>
                  <p className="text-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}