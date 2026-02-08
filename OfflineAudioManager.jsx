import { useState, useEffect } from 'react';

// Simulate IndexedDB for offline audio storage
class OfflineAudioCache {
  constructor() {
    this.cache = new Map();
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('offline_audio_cache');
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(Object.entries(data));
      }
    } catch (e) {
      console.error('Failed to load offline cache', e);
    }
  }

  saveToStorage() {
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem('offline_audio_cache', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save offline cache', e);
    }
  }

  async cacheAudio(songId, audioUrl) {
    // In production, this would fetch and store the actual audio blob
    // For demo, we store the URL with a timestamp
    this.cache.set(songId, {
      url: audioUrl,
      cachedAt: Date.now(),
      size: Math.random() * 10000000 + 5000000 // 5-15MB
    });
    this.saveToStorage();
    return true;
  }

  hasOfflineAudio(songId) {
    return this.cache.has(songId);
  }

  getOfflineAudio(songId) {
    const cached = this.cache.get(songId);
    return cached?.url;
  }

  removeOfflineAudio(songId) {
    this.cache.delete(songId);
    this.saveToStorage();
  }

  clearAll() {
    this.cache.clear();
    this.saveToStorage();
  }

  getAllCached() {
    return Array.from(this.cache.keys());
  }
}

export const offlineAudioCache = new OfflineAudioCache();

export function useOfflineAudio(songId, audioUrl) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasOfflineVersion, setHasOfflineVersion] = useState(false);
  const [audioSource, setAudioSource] = useState(audioUrl);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (songId) {
      const hasOffline = offlineAudioCache.hasOfflineAudio(songId);
      setHasOfflineVersion(hasOffline);

      if (isOffline && hasOffline) {
        const offlineUrl = offlineAudioCache.getOfflineAudio(songId);
        setAudioSource(offlineUrl);
      } else {
        setAudioSource(audioUrl);
      }
    }
  }, [songId, audioUrl, isOffline]);

  return {
    audioSource,
    isOffline,
    hasOfflineVersion,
    canPlay: !isOffline || hasOfflineVersion
  };
}

export async function downloadSongForOffline(songId, audioUrl, onProgress) {
  try {
    // Simulate download with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (onProgress) onProgress(i);
    }
    
    await offlineAudioCache.cacheAudio(songId, audioUrl);
    return true;
  } catch (error) {
    console.error('Failed to download for offline', error);
    return false;
  }
}