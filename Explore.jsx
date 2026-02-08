import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { useTranslation } from '@/components/TranslationProvider';
import { Search, Filter, X, Sparkles, TrendingUp, Video, Star, Users, Music, Disc, Mic2, Activity, Calendar, Settings, User, Music2, Heart, Smile, Dumbbell, Wind, Sun, Moon, Headphones, Volume2, Shield } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SongCard from '@/components/cards/SongCard';

const LANGUAGES = [
  { value: 'all', label: 'All Languages', flag: '🌍' },
  { value: 'german', label: 'German', flag: '🇩🇪' },
  { value: 'english', label: 'English', flag: '🇬🇧' },
];

const DIFFICULTIES = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const GENRES = [
  { value: 'all', label: 'All Genres' },
  { value: 'pop', label: 'Pop' },
  { value: 'rock', label: 'Rock' },
  { value: 'hip-hop', label: 'Hip-Hop' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'classical', label: 'Classical' },
  { value: 'folk', label: 'Folk' },
  { value: 'jazz', label: 'Jazz' },
];

const MODES = [
  { value: 'all', label: 'All Modes' },
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'focus', label: 'Focus' },
];

const DECADES = [
  { value: 'all', label: 'All Decades' },
  { value: '2020s', label: '2020s' },
  { value: '2010s', label: '2010s' },
  { value: '2000s', label: '2000s' },
  { value: '90s', label: '90s' },
  { value: '80s', label: '80s' },
];

const QUICK_FILTERS = [
  { icon: Sparkles, label: 'New', value: 'new' },
  { icon: TrendingUp, label: 'Top', value: 'top' },
  { icon: Video, label: 'Videos', value: 'videos' },
  { icon: Headphones, label: 'HiRes', value: 'hires' },
  { icon: Shield, label: 'Clean Content', value: 'clean' },
  { icon: Star, label: 'Staff Picks', value: 'staff-picks' },
  { icon: Users, label: 'Creator Hub', value: 'creator-hub' },
];

const GENRE_TOPICS = [
  { icon: Mic2, label: 'Hip-Hop', value: 'hip-hop' },
  { icon: Music2, label: 'Pop', value: 'pop' },
  { icon: Music, label: 'R&B', value: 'r&b' },
  { icon: Disc, label: 'Rock', value: 'rock' },
  { icon: Mic2, label: 'Rap', value: 'rap' },
  { icon: Music, label: 'Jazz', value: 'jazz' },
  { icon: Music2, label: 'Classic', value: 'classical' },
];

const MOOD_TOPICS = [
  { icon: Disc, label: 'For DJs', value: 'for-djs' },
  { icon: Music2, label: 'Record Labels', value: 'record-labels' },
  { icon: Users, label: 'Collabs', value: 'collabs' },
  { icon: Music, label: 'Music School', value: 'music-school' },
  { icon: Dumbbell, label: 'Workout', value: 'workout' },
  { icon: Moon, label: 'Sleep', value: 'sleep' },
  { icon: Smile, label: 'Party', value: 'party' },
  { icon: Wind, label: 'Relax', value: 'relax' },
];

const DECADE_TOPICS = [
  { icon: Calendar, label: '1950s', value: '1950s' },
  { icon: Calendar, label: '1960s', value: '1960s' },
  { icon: Calendar, label: '1970s', value: '1970s' },
  { icon: Calendar, label: '1980s', value: '1980s' },
  { icon: Calendar, label: '1990s', value: '1990s' },
  { icon: Calendar, label: '2000s', value: '2000s' },
];

export default function Explore() {
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState(urlParams.get('language') || 'all');
  const [difficulty, setDifficulty] = useState(urlParams.get('difficulty') || 'all');
  const [genre, setGenre] = useState('all');
  const [mode, setMode] = useState('all');
  const [decade, setDecade] = useState('all');
  const [quickFilter, setQuickFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: () => base44.entities.Song.list('-created_date', 100)
  });

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch = !searchQuery || 
        song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLanguage = language === 'all' || song.language === language;
      const matchesDifficulty = difficulty === 'all' || song.difficulty === difficulty;
      const matchesGenre = genre === 'all' || song.genre === genre;
      
      return matchesSearch && matchesLanguage && matchesDifficulty && matchesGenre;
    });
  }, [songs, searchQuery, language, difficulty, genre]);

  const activeFiltersCount = [
    language !== 'all',
    difficulty !== 'all',
    genre !== 'all',
    mode !== 'all',
    decade !== 'all'
  ].filter(Boolean).length;

  const clearFilters = () => {
    setLanguage('all');
    setDifficulty('all');
    setGenre('all');
    setMode('all');
    setDecade('all');
    setQuickFilter('');
  };

  return (
    <div className="min-h-screen px-6 lg:px-12 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-white text-3xl font-bold">{t('explore')}</h1>
      </div>



      {/* Search */}
      <div className="mb-10">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder={t('searchForSongs')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-10 rounded-md text-sm"
          />
        </div>
      </div>



      {/* Browse Topics */}
      {!searchQuery && activeFiltersCount === 0 && (
        <>
          {/* Quick Filters */}
          <section className="mb-10">
            <div className="space-y-1">
              {QUICK_FILTERS.map((filter) => (
                <div
                  key={filter.value}
                  onClick={() => setQuickFilter(quickFilter === filter.value ? '' : filter.value)}
                  className="cursor-pointer py-3 px-4 hover:bg-zinc-900 rounded-md transition-colors flex items-center gap-3"
                >
                  <filter.icon className="h-4 w-4 text-zinc-400" />
                  <h3 className="text-white font-normal text-base">{filter.label}</h3>
                </div>
              ))}
            </div>
          </section>
        <div className="space-y-10 mb-12">
          {/* Genres */}
          <section>
            <h2 className="text-white text-xl font-bold mb-5">{t('genres')}</h2>
            <div className="space-y-1">
              {GENRE_TOPICS.map((topic) => (
                <div
                  key={topic.value}
                  onClick={() => setGenre(topic.value)}
                  className="cursor-pointer py-3 px-4 hover:bg-zinc-900 rounded-md transition-colors"
                >
                  <h3 className="text-white font-normal text-base">{topic.label}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Moods & Activities */}
          <section>
            <h2 className="text-white text-xl font-bold mb-5">{t('moodsActivities')}</h2>
            <div className="space-y-1">
              {MOOD_TOPICS.map((topic) => (
                <div
                  key={topic.value}
                  onClick={() => setMode(topic.value)}
                  className="cursor-pointer py-3 px-4 hover:bg-zinc-900 rounded-md transition-colors"
                >
                  <h3 className="text-white font-normal text-base">{topic.label}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Decades */}
          <section>
            <h2 className="text-white text-xl font-bold mb-5">{t('decades')}</h2>
            <div className="space-y-1">
              {DECADE_TOPICS.map((topic) => (
                <div
                  key={topic.value}
                  onClick={() => setDecade(topic.value)}
                  className="cursor-pointer py-3 px-4 hover:bg-zinc-900 rounded-md transition-colors"
                >
                  <h3 className="text-white font-normal text-base">{topic.label}</h3>
                </div>
              ))}
            </div>
          </section>
          </div>
          </>

      )}



      {(searchQuery || activeFiltersCount > 0) && (isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-2xl bg-zinc-800" />
              <Skeleton className="h-4 w-3/4 bg-zinc-800" />
              <Skeleton className="h-3 w-1/2 bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : filteredSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-zinc-500 text-sm">{t('noResults')}</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filteredSongs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
            >
              <SongCard
                song={song}
                variant="compact"
                onClick={() => window.location.href = createPageUrl('Player') + `?songId=${song.id}`}
              />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}