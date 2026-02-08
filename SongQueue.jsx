import React from 'react';
import { X, GripVertical, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function SongQueue({ 
  queue, 
  currentSongId, 
  onReorder, 
  onRemove, 
  onPlayNow 
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800">
        <h3 className="text-white font-semibold">Queue</h3>
        <p className="text-zinc-500 text-sm">{queue.length} songs</p>
      </div>

      <ScrollArea className="flex-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="queue">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="p-2 space-y-1"
              >
                {queue.map((song, index) => (
                  <Draggable key={song.id} draggableId={song.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-colors group",
                          snapshot.isDragging && "bg-zinc-800/80 shadow-lg",
                          !snapshot.isDragging && "hover:bg-zinc-800/50",
                          currentSongId === song.id && "bg-emerald-500/10 border border-emerald-500/20"
                        )}
                      >
                        <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                          <GripVertical className="h-4 w-4 text-zinc-600" />
                        </div>

                        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                          {song.cover_image ? (
                            <img src={song.cover_image} alt={song.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-700" />
                          )}
                          {currentSongId === song.id && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "text-sm font-medium truncate",
                            currentSongId === song.id ? "text-emerald-400" : "text-white"
                          )}>
                            {song.title}
                          </h4>
                          <p className="text-zinc-500 text-xs truncate">{song.artist}</p>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {currentSongId !== song.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-emerald-400"
                              onClick={() => onPlayNow(song.id)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-red-400"
                            onClick={() => onRemove(song.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ScrollArea>
    </div>
  );
}