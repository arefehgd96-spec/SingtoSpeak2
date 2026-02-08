import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { BookOpen, Languages } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import WordDefinition from './WordDefinition';

export default function LyricsDisplay({ 
  lyrics = [], 
  currentTime = 0,
  showTranslation = true 
}) {
  const [user, setUser] = useState(null);
  const [translatedLyrics, setTranslatedLyrics] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {}
    };
    loadUser();
  }, []);

  useEffect(() => {
    const translateLyrics = async () => {
      if (!user?.translation_language || user.translation_language === 'english' || !lyrics.length) {
        setTranslatedLyrics(lyrics);
        return;
      }

      try {
        const translated = await Promise.all(
          lyrics.map(async (lyric) => {
            if (!lyric.translation) return lyric;
            
            const result = await base44.integrations.Core.InvokeLLM({
              prompt: `Translate this text to ${user.translation_language}: "${lyric.translation}"
              
              Return ONLY the translation, no explanations.`,
              response_json_schema: {
                type: "object",
                properties: {
                  translation: { type: "string" }
                }
              }
            });

            return {
              ...lyric,
              translation: result.translation
            };
          })
        );
        setTranslatedLyrics(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedLyrics(lyrics);
      }
    };

    translateLyrics();
  }, [user?.translation_language, lyrics]);
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  const displayLyrics = translatedLyrics.length > 0 ? translatedLyrics : lyrics;

  // Find current lyric index
  const currentIndex = displayLyrics.findIndex((lyric, index) => {
    const nextLyric = displayLyrics[index + 1];
    return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
  });

  // Auto-scroll to active lyric
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentIndex]);

  if (!displayLyrics.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
        <BookOpen className="h-12 w-12" />
        <p>No lyrics available for this song</p>
      </div>
    );
  }

  const handleWordClick = (word) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '').trim();
    if (cleanWord.length > 2) {
      setSelectedWord(cleanWord);
    }
  };

  return (
    <>
      <AnimatePresence>
        {selectedWord && (
          <WordDefinition word={selectedWord} onClose={() => setSelectedWord(null)} />
        )}
      </AnimatePresence>
      
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto px-6 py-12 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          {displayLyrics.map((lyric, index) => {
          const isActive = index === currentIndex;
          const isPast = index < currentIndex;

          return (
            <motion.div
              key={index}
              ref={isActive ? activeRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className={cn(
                "transition-all duration-300 cursor-pointer group",
                isActive && "scale-105",
                isPast && "opacity-40"
              )}
            >
              <p className={cn(
                "text-xl md:text-2xl font-medium leading-relaxed transition-colors",
                isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"
              )}>
                {lyric.original.split(' ').map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    onClick={() => handleWordClick(word)}
                    className="cursor-pointer hover:text-emerald-400 transition-colors inline-block"
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
              
              {showTranslation && lyric.translation && (
                <p className={cn(
                  "text-base md:text-lg mt-2 flex items-center gap-2 transition-colors",
                  isActive ? "text-emerald-400" : "text-zinc-600 group-hover:text-zinc-500"
                )}>
                  <Languages className="h-4 w-4 flex-shrink-0" />
                  {lyric.translation}
                </p>
              )}
            </motion.div>
          );
          })}
        </div>
      </div>
    </>
  );
}