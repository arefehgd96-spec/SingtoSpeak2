import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Check, Loader2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { offlineAudioCache, downloadSongForOffline } from '@/components/offline/OfflineAudioManager';

export default function DownloadButton({ itemType, itemId, user, size = "default", song }) {
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: downloads = [] } = useQuery({
    queryKey: ['downloads', user?.email],
    queryFn: () => base44.entities.Download.filter({ created_by: user.email }),
    enabled: !!user
  });

  const existingDownload = downloads.find(d => d.item_id === itemId && d.item_type === itemType);
  const isDownloaded = existingDownload?.status === 'completed';

  const downloadMutation = useMutation({
    mutationFn: async () => {
      setIsDownloading(true);
      // Simulate download process
      const download = await base44.entities.Download.create({
        item_type: itemType,
        item_id: itemId,
        status: 'downloading',
        progress: 0,
        file_size: Math.floor(Math.random() * 50000000) + 10000000 // 10-60MB
      });

      // Simulate progressive download
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        await base44.entities.Download.update(download.id, {
          progress: i,
          status: i === 100 ? 'completed' : 'downloading',
          downloaded_at: i === 100 ? new Date().toISOString() : undefined
        });
        queryClient.invalidateQueries(['downloads']);
      }

      // Cache audio for offline playback
      if (itemType === 'song' && song?.audio_url) {
        await offlineAudioCache.cacheAudio(itemId, song.audio_url);
      }

      setIsDownloading(false);
      return download;
    },
    onSuccess: () => {
      toast.success(`Downloaded for offline playback`);
      queryClient.invalidateQueries(['downloads']);
    },
    onError: () => {
      setIsDownloading(false);
      toast.error('Download failed');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Download.delete(existingDownload.id);
      // Remove from offline cache
      if (itemType === 'song') {
        offlineAudioCache.removeOfflineAudio(itemId);
      }
    },
    onSuccess: () => {
      toast.success('Download removed');
      queryClient.invalidateQueries(['downloads']);
    }
  });

  if (!user) return null;

  if (isDownloaded) {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={(e) => {
          e.stopPropagation();
          deleteMutation.mutate();
        }}
        className="text-emerald-400"
      >
        <Check className={cn("h-4 w-4", size === "icon" ? "" : "mr-2")} />
        {size !== "icon" && "Downloaded"}
      </Button>
    );
  }

  if (isDownloading || existingDownload?.status === 'downloading') {
    return (
      <Button variant="ghost" size={size} disabled>
        <Loader2 className={cn("h-4 w-4 animate-spin", size === "icon" ? "" : "mr-2")} />
        {size !== "icon" && `${existingDownload?.progress || 0}%`}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={(e) => {
        e.stopPropagation();
        downloadMutation.mutate();
      }}
      className="text-zinc-400 hover:text-white"
    >
      <Download className={cn("h-4 w-4", size === "icon" ? "" : "mr-2")} />
      {size !== "icon" && "Download"}
    </Button>
  );
}