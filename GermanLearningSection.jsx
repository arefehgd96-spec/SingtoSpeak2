import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Target, Award, CheckCircle2, Lock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from '@/components/TranslationProvider';

const grammarTopics = [
  { title: 'Articles & Nouns', level: 'A1', progress: 75, topics: ['der, die, das', 'Artikel', 'Nouns', 'Personal pronouns'] },
  { title: 'Verbs & Negation', level: 'A1', progress: 70, topics: ['Verben', 'Present tense basics', 'Negation (nicht, kein)'] },
  { title: 'Prepositions & Adverbs', level: 'A1', progress: 65, topics: ['Präpositionen', 'Adverben', 'Basic word order'] },
  { title: 'Accusative Case', level: 'A1', progress: 60, topics: ['Akkusativ', 'Direct objects', 'Accusative prepositions'] },
  { title: 'Present Tense', level: 'A1-A2', progress: 55, topics: ['Regular verbs', 'Irregular verbs', 'Modal verbs'] },
  { title: 'Cases', level: 'A2', progress: 40, topics: ['Nominative', 'Accusative', 'Dative', 'Genitive'] },
  { title: 'Past Tense', level: 'B1', progress: 30, topics: ['Perfekt', 'Präteritum', 'Plusquamperfekt'] },
  { title: 'Advanced Grammar', level: 'B2-C1', progress: 15, topics: ['Subjunctive', 'Passive voice', 'Relative clauses'] }
];

const cerfLevels = [
  { 
    level: 'A1', 
    name: 'Beginner', 
    description: 'Basic phrases and expressions', 
    bgColor: 'bg-slate-800/60',
    accentColor: 'border-slate-600',
    textColor: 'text-slate-300',
    songs: 12,
    exercises: 45
  },
  { 
    level: 'A2', 
    name: 'Elementary', 
    description: 'Everyday situations', 
    bgColor: 'bg-teal-900/40',
    accentColor: 'border-teal-700',
    textColor: 'text-teal-300',
    songs: 18,
    exercises: 68
  },
  { 
    level: 'B1', 
    name: 'Intermediate', 
    description: 'Familiar matters', 
    bgColor: 'bg-indigo-900/40',
    accentColor: 'border-indigo-700',
    textColor: 'text-indigo-300',
    songs: 24,
    exercises: 92
  },
  { 
    level: 'B2', 
    name: 'Upper Intermediate', 
    description: 'Complex texts', 
    bgColor: 'bg-purple-900/40',
    accentColor: 'border-purple-700',
    textColor: 'text-purple-300',
    songs: 32,
    exercises: 115
  },
  { 
    level: 'C1', 
    name: 'Advanced', 
    description: 'Fluent and flexible', 
    bgColor: 'bg-rose-900/40',
    accentColor: 'border-rose-700',
    textColor: 'text-rose-300',
    songs: 28,
    exercises: 87
  },
  { 
    level: 'C2', 
    name: 'Mastery', 
    description: 'Native-like proficiency', 
    bgColor: 'bg-amber-900/40',
    accentColor: 'border-amber-700',
    textColor: 'text-amber-300',
    songs: 35,
    exercises: 103
  }
];

export default function GermanLearningSection({ userLevel = 'A1', showGrammar = true }) {
  const { t } = useTranslation();
  const currentLevelIndex = cerfLevels.findIndex(l => l.level === userLevel);
  
  return (
    <div className="space-y-10 mb-10">
      {/* CEFR Levels - Journey Style */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">{t('germanProficiency')}</h2>
          <p className="text-zinc-500 text-sm mt-1">{t('cefrFramework')}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {cerfLevels.map((item, index) => {
            const isPassed = index < currentLevelIndex;
            const isCurrent = item.level === userLevel;
            const isLocked = index > currentLevelIndex;
            
            return (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`
                  ${item.bgColor} border-2 ${item.accentColor}
                  ${isCurrent ? 'ring-2 ring-white/40' : ''}
                  ${isLocked ? 'opacity-40' : ''}
                  transition-all hover:border-opacity-100
                `}>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <div className={`text-3xl font-bold mb-1 ${item.textColor}`}>
                        {item.level}
                      </div>
                      <div className="text-white text-sm font-medium mb-1">
                        {item.name}
                      </div>
                      <div className="text-zinc-400 text-xs leading-relaxed">
                        {item.description}
                      </div>
                    </div>
                    
                    {!isLocked && (
                      <div className="pt-3 border-t border-zinc-700/50 flex justify-between text-xs">
                        <span className="text-zinc-500">{item.songs} {t('songs')}</span>
                        <span className="text-zinc-500">{item.exercises} {t('ex')}</span>
                      </div>
                    )}
                    
                    {isCurrent && (
                      <div className="mt-2">
                        <Badge className={`${item.bgColor} ${item.textColor} border-0 text-[10px]`}>
                          {t('current')}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Grammar Topics */}
      {showGrammar && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-amber-500" />
            <h2 className="text-2xl font-bold text-white">{t('grammarLearningPath')}</h2>
          </div>
          
          <div className="space-y-4">
            {grammarTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 hover:border-emerald-600/50 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">{topic.title}</h3>
                          <Badge variant="outline" className="text-xs text-white border-emerald-700/50">
                            {topic.level}
                          </Badge>
                        </div>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {topic.topics.map((t, i) => (
                            <span key={i} className="text-xs text-white">• {t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-600 font-bold text-lg">{topic.progress}%</div>
                      </div>
                    </div>
                    
                    <Progress value={topic.progress} className="h-2 bg-zinc-800 [&>div]:bg-emerald-600" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}