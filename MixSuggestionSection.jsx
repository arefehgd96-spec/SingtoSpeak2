import React from 'react';
import { motion } from 'framer-motion';
import { Shuffle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from '@/components/TranslationProvider';

export default function MixSuggestionSection({ mixes, onMixClick }) {
  const { t } = useTranslation();
  if (!mixes || mixes.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <Shuffle className="h-5 w-5 text-violet-400" />
        <h2 className="text-2xl font-bold text-white">{t('mixesForYou')}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mixes.map((mix, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
              onClick={() => onMixClick(mix)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Shuffle className="h-7 w-7 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </div>
                
                <h3 className="text-white font-medium text-base mb-2">{mix.title}</h3>
                <p className="text-zinc-400 text-xs mb-3">{mix.description}</p>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                    {mix.language}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-700">
                    {mix.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}