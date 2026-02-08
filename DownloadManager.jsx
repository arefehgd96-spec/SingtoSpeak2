import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Trash2, Music, List, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useTranslation } from '@/components/TranslationProvider';

export default function DownloadManager({ user }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: downloads = [] } = useQuery({
    queryKey: ['downloads', user?.email],
    queryFn: () => base44.entities.Download.filter({ created_by: user.email }),
    enabled: !!user
  });

  const { data: songs = [] } = useQuery({
    queryKey: ['songs'],
    queryFn: () => base44.entities.Song.list()
  });

  const { data: playlists = [] } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => base44.entities.Playlist.list()
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Download.delete(id),
    onSuccess: () => {
      toast.success('Download removed');
      queryClient.invalidateQueries(['downloads']);
    }
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      for (const download of downloads) {
        await base44.entities.Download.delete(download.id);
      }
    },
    onSuccess: () => {
      toast.success('All downloads removed');
      queryClient.invalidateQueries(['downloads']);
    }
  });

  const completedDownloads = downloads.filter(d => d.status === 'completed');
  const activeDownloads = downloads.filter(d => d.status === 'downloading' || d.status === 'pending');
  
  const totalSize = completedDownloads.reduce((sum, d) => sum + (d.file_size || 0), 0);
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + ' MB';
  };

  const getItemName = (download) => {
    if (download.item_type === 'song') {
      const song = songs.find(s => s.id === download.item_id);
      return song ? `${song.title} - ${song.artist}` : 'Unknown Song';
    } else if (download.item_type === 'playlist') {
      const playlist = playlists.find(p => p.id === download.item_id);
      return playlist?.name || 'Unknown Playlist';
    }
    return 'Unknown Item';
  };

  return (
    <div className="space-y-6">
      {/* Storage Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              {t('storage')}
            </span>
            {completedDownloads.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteAllMutation.mutate()}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('clearAll')}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{completedDownloads.length} {t('itemsDownloaded')}</span>
              <span className="text-foreground font-medium">{formatSize(totalSize)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Downloads */}
      {activeDownloads.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Download className="h-5 w-5 animate-pulse" />
              {t('downloading_active')} ({activeDownloads.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDownloads.map(download => (
              <div key={download.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {download.item_type === 'song' ? (
                      <Music className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <List className="h-5 w-5 text-emerald-400" />
                    )}
                    <div>
                      <p className="text-foreground text-sm font-medium">{getItemName(download)}</p>
                      <p className="text-muted-foreground text-xs">{formatSize(download.file_size || 0)}</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-sm font-medium">{download.progress}%</span>
                </div>
                <Progress value={download.progress} className="h-1" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Downloaded Items */}
      {completedDownloads.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Download className="h-5 w-5" />
              {t('downloaded')} ({completedDownloads.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedDownloads.map(download => (
              <div key={download.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  {download.item_type === 'song' ? (
                    <Music className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <List className="h-5 w-5 text-emerald-400" />
                  )}
                  <div>
                    <p className="text-foreground text-sm font-medium">{getItemName(download)}</p>
                    <p className="text-muted-foreground text-xs">{formatSize(download.file_size || 0)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(download.id)}
                  className="text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {downloads.length === 0 && (
        <div className="text-center py-12">
          <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('noDownloadsYet')}</p>
          <p className="text-muted-foreground text-sm mt-1">{t('downloadSongsForOffline')}</p>
        </div>
      )}
    </div>
  );
}