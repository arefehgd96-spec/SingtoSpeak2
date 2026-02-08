import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, X, Loader2, Music } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

export default function PlaylistGenerator({ onClose, user }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    language: 'mixed',
    difficulty: 'mixed',
    genre: '',
    goal: ''
  });

  const queryClient = useQueryClient();

  const handleGenerate = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    setIsGenerating(true);

    try {
      // Fetch user's listening history
      const userProgress = await base44.entities.UserProgress.filter({
        created_by: user.email
      });

      // Fetch all songs
      const allSongs = await base44.entities.Song.list();

      // Build context for AI
      const playedSongIds = userProgress.map(p => p.song_id);
      const playedSongs = allSongs.filter(s => playedSongIds.includes(s.id));
      const favoriteSongs = playedSongs.filter(s => {
        const prog = userProgress.find(p => p.song_id === s.id);
        return prog?.favorite;
      });

      // Prepare AI prompt
      const prompt = `You are a music-based language learning expert. Generate a personalized playlist for a user.

User Context:
- Listening History: ${playedSongs.length} songs played
- Favorite Songs: ${favoriteSongs.map(s => `${s.title} by ${s.artist} (${s.language}, ${s.difficulty})`).join(', ') || 'None yet'}
- Total Words Learned: ${userProgress.reduce((acc, p) => acc + (p.learned_words?.length || 0), 0)}

Playlist Requirements:
- Name: "${formData.name}"
- Language: ${formData.language}
- Difficulty: ${formData.difficulty}
- Genre Preference: ${formData.genre || 'Any'}
- Learning Goal: ${formData.goal || 'General language learning'}

Available Songs:
${allSongs.map(s => `- ID: ${s.id}, Title: "${s.title}", Artist: "${s.artist}", Language: ${s.language}, Difficulty: ${s.difficulty}, Genre: ${s.genre || 'unknown'}`).join('\n')}

Based on the user's history and the requirements, select 8-12 songs that would create an optimal learning playlist. Consider:
1. Matching the language and difficulty preferences
2. Variety in artists and genres (unless specific genre requested)
3. Progression in difficulty if mixed difficulty
4. Including some familiar songs if user has history
5. Balancing new vocabulary introduction

Return ONLY the song IDs that should be included in the playlist.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            song_ids: {
              type: "array",
              items: { type: "string" },
              description: "Selected song IDs for the playlist"
            },
            reasoning: {
              type: "string",
              description: "Brief explanation of the selection"
            }
          }
        }
      });

      // Create the playlist
      const newPlaylist = await base44.entities.Playlist.create({
        name: formData.name,
        description: aiResponse.reasoning || `AI-generated playlist for ${formData.goal || 'language learning'}`,
        language: formData.language,
        difficulty: formData.difficulty,
        song_ids: aiResponse.song_ids,
        cover_image: allSongs.find(s => aiResponse.song_ids.includes(s.id))?.cover_image
      });

      queryClient.invalidateQueries(['playlists']);
      toast.success(`✨ Created "${formData.name}" with ${aiResponse.song_ids.length} songs!`);
      onClose();
    } catch (error) {
      toast.error('Failed to generate playlist. Please try again.');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg"
      >
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                AI Playlist Generator
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-zinc-400 hover:text-white"
                disabled={isGenerating}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="playlist-name" className="text-white">Playlist Name *</Label>
              <Input
                id="playlist-name"
                placeholder="e.g., Beginner German Pop Playlist"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                disabled={isGenerating}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                  disabled={isGenerating}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="german">German 🇩🇪</SelectItem>
                    <SelectItem value="english">English 🇬🇧</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  disabled={isGenerating}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className="text-white">Genre (Optional)</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => setFormData({ ...formData, genre: value })}
                disabled={isGenerating}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Any genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Any</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="folk">Folk</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal" className="text-white">Learning Goal (Optional)</Label>
              <Input
                id="goal"
                placeholder="e.g., Expand vocabulary, Improve pronunciation"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                disabled={isGenerating}
              />
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-4">
              <p className="text-emerald-400 text-sm flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  AI will analyze your listening history and create a personalized playlist tailored to your preferences and learning goals.
                </span>
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.name.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Playlist...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Playlist
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}