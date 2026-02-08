import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function SongGenerator({ onClose, user }) {
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    theme: '',
    artist: '',
    language: 'german',
    difficulty: 'beginner',
    genre: 'pop',
    mood: 'upbeat',
    vocabFocus: ''
  });

  const generateSongMutation = useMutation({
    mutationFn: async (data) => {
      setGenerating(true);
      
      // Generate song content using AI
      const prompt = `Generate a complete song for language learning with the following specifications:

Language: ${data.language === 'german' ? 'German' : 'English'}
Difficulty Level: ${data.difficulty} (CEFR ${data.difficulty === 'beginner' ? 'A1-A2' : data.difficulty === 'intermediate' ? 'B1-B2' : 'C1-C2'})
Genre: ${data.genre}
Mood: ${data.mood}
Theme: ${data.theme}
Artist Name: ${data.artist}
${data.vocabFocus ? `Vocabulary Focus: ${data.vocabFocus}` : ''}

Create a song that:
1. Has simple, memorable lyrics appropriate for ${data.difficulty} level learners
2. Uses common vocabulary and grammatical structures for this level
3. Includes cultural context when relevant
4. Has a clear, repetitive structure (verse-chorus-verse-chorus-bridge-chorus)
5. Focuses on everyday situations and practical language use

Return the response in the following JSON structure (make sure it's valid JSON):
{
  "title": "song title in ${data.language}",
  "lyrics": [
    {"time": 0, "original": "first line in ${data.language}", "translation": "English translation"},
    {"time": 5, "original": "second line in ${data.language}", "translation": "English translation"}
  ],
  "vocabulary": [
    {"word": "key word", "translation": "English translation", "example": "example sentence"}
  ],
  "chord_progression": "C G Am F (or appropriate chords for the genre)",
  "bpm": 120,
  "key": "C major",
  "duration_seconds": 180
}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            lyrics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  time: { type: "number" },
                  original: { type: "string" },
                  translation: { type: "string" }
                }
              }
            },
            vocabulary: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  word: { type: "string" },
                  translation: { type: "string" },
                  example: { type: "string" }
                }
              }
            },
            chord_progression: { type: "string" },
            bpm: { type: "number" },
            key: { type: "string" },
            duration_seconds: { type: "number" }
          }
        }
      });

      // Generate cover image
      const imagePrompt = `Album cover art for a ${data.genre} song titled "${response.title}" by ${data.artist}. Style: modern, vibrant, professional music album cover, ${data.mood} mood, abstract design`;
      
      const imageResponse = await base44.integrations.Core.GenerateImage({
        prompt: imagePrompt
      });

      // Create song entity
      const songData = {
        title: response.title,
        artist: data.artist,
        language: data.language,
        difficulty: data.difficulty,
        genre: data.genre,
        cover_image: imageResponse.url,
        lyrics: response.lyrics,
        vocabulary: response.vocabulary,
        duration_seconds: response.duration_seconds || 180,
        play_count: 0
      };

      return base44.entities.Song.create(songData);
    },
    onSuccess: (newSong) => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      toast.success(`${newSong.title} generated successfully!`);
      setGenerating(false);
      onClose();
    },
    onError: (error) => {
      console.error('Error generating song:', error);
      toast.error('Failed to generate song. Please try again.');
      setGenerating(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.theme || !formData.artist) {
      toast.error('Please provide a theme and artist name');
      return;
    }
    generateSongMutation.mutate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Song Generator</h2>
              <p className="text-zinc-500 text-sm">Create a custom learning song</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-white">
              Theme / Topic *
            </Label>
            <Input
              id="theme"
              placeholder="e.g., ordering food at a restaurant, introducing yourself"
              value={formData.theme}
              onChange={(e) => setFormData({...formData, theme: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
            <p className="text-zinc-500 text-xs">What should the song be about?</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist" className="text-white">
              Artist Name *
            </Label>
            <Input
              id="artist"
              placeholder="e.g., AI Learning Band"
              value={formData.artist}
              onChange={(e) => setFormData({...formData, artist: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-white">Language</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="german">🇩🇪 German</SelectItem>
                  <SelectItem value="english">🇬🇧 English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-white">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (A1-A2)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (B1-B2)</SelectItem>
                  <SelectItem value="advanced">Advanced (C1-C2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-white">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({...formData, genre: value})}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="folk">Folk</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood" className="text-white">Mood</Label>
              <Select value={formData.mood} onValueChange={(value) => setFormData({...formData, mood: value})}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upbeat">Upbeat</SelectItem>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="melancholic">Melancholic</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vocab" className="text-white">
              Vocabulary Focus (Optional)
            </Label>
            <Textarea
              id="vocab"
              placeholder="e.g., food vocabulary, greetings, travel phrases"
              value={formData.vocabFocus}
              onChange={(e) => setFormData({...formData, vocabFocus: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white h-20"
            />
            <p className="text-zinc-500 text-xs">Specific words or phrases to include</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-zinc-700"
              disabled={generating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Song
                </>
              )}
            </Button>
          </div>

          {generating && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <p className="text-emerald-400 text-sm text-center">
                Creating your custom song... This may take 30-60 seconds
              </p>
            </div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}