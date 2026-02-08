import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function MiniPlayer({ 
  song, 
  isPlaying, 
  onPlayPause, 
  progress = 0, 
  onSeek,
  onNext,
  onPrevious,
  isFavorite,
  onToggleFavorite
}) {
  if (!song) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * (song.duration_seconds || 180);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 backdrop-blur-xl z-50">
      <div className="h-1 bg-zinc-800 relative">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
              {song.cover_image ? (
                <img 
                  src={song.cover_image} 
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-700" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-white font-medium text-sm truncate">{song.title}</h4>
              <p className="text-zinc-400 text-xs truncate">{song.artist}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-zinc-400 hover:text-emerald-400"
              onClick={onToggleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-emerald-400 text-emerald-400")} />
            </Button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hidden sm:flex"
              onClick={onPrevious}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              size="icon"
              className="bg-white hover:bg-zinc-200 text-black rounded-full h-10 w-10"
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hidden sm:flex"
              onClick={onNext}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Time & Volume */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
            <span className="text-xs text-zinc-500 tabular-nums">
              {formatTime(currentTime)} / {formatTime(song.duration_seconds || 180)}
            </span>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-zinc-400" />
              <Slider
                defaultValue={[80]}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}