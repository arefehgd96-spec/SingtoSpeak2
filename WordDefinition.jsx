import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function WordDefinition({ word, onClose }) {
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDefinition = async () => {
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Provide a detailed definition and usage for the word "${word}". Include:
          1. Translation
          2. Definition
          3. Example sentences
          4. Common phrases`,
          response_json_schema: {
            type: "object",
            properties: {
              translation: { type: "string" },
              definition: { type: "string" },
              examples: { type: "array", items: { type: "string" } },
              phrases: { type: "array", items: { type: "string" } }
            }
          }
        });
        setDefinition(result);
      } catch (error) {
        console.error('Failed to fetch definition:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [word]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-2xl font-bold">{word}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5 text-zinc-400" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          </div>
        ) : definition ? (
          <div className="space-y-4">
            <div>
              <p className="text-zinc-500 text-sm mb-1">Translation</p>
              <p className="text-white text-lg">{definition.translation}</p>
            </div>

            <div>
              <p className="text-zinc-500 text-sm mb-1">Definition</p>
              <p className="text-zinc-300">{definition.definition}</p>
            </div>

            {definition.examples?.length > 0 && (
              <div>
                <p className="text-zinc-500 text-sm mb-2">Examples</p>
                <div className="space-y-2">
                  {definition.examples.map((example, idx) => (
                    <div key={idx} className="bg-zinc-800/50 rounded-lg p-3">
                      <p className="text-zinc-300 text-sm">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {definition.phrases?.length > 0 && (
              <div>
                <p className="text-zinc-500 text-sm mb-2">Common Phrases</p>
                <div className="flex flex-wrap gap-2">
                  {definition.phrases.map((phrase, idx) => (
                    <span key={idx} className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-zinc-500 text-center py-8">Failed to load definition</p>
        )}
      </motion.div>
    </motion.div>
  );
}