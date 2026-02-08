import React from 'react';
import { Settings2, Sliders, Gauge } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export default function PlayerSettings({ 
  playbackRate, 
  onPlaybackRateChange,
  crossfadeDuration,
  onCrossfadeDurationChange,
  eqSettings,
  onEqChange 
}) {
  const speedPresets = [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: 'Normal' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
  ];

  const eqBands = [
    { id: 'bass', label: 'Bass', freq: '60Hz' },
    { id: 'lowMid', label: 'Low Mid', freq: '250Hz' },
    { id: 'mid', label: 'Mid', freq: '1kHz' },
    { id: 'highMid', label: 'High Mid', freq: '4kHz' },
    { id: 'treble', label: 'Treble', freq: '16kHz' },
  ];

  const eqPresets = {
    flat: { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 },
    bass: { bass: 8, lowMid: 4, mid: 0, highMid: -2, treble: -4 },
    vocal: { bass: -2, lowMid: 2, mid: 6, highMid: 4, treble: 0 },
    treble: { bass: -4, lowMid: -2, mid: 0, highMid: 4, treble: 8 },
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
          <Settings2 className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 bg-zinc-900 border-zinc-800 text-white" align="end">
        <Tabs defaultValue="speed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
            <TabsTrigger value="speed" className="text-xs">
              <Gauge className="h-3 w-3 mr-1" />
              Speed
            </TabsTrigger>
            <TabsTrigger value="equalizer" className="text-xs">
              <Sliders className="h-3 w-3 mr-1" />
              Equalizer
            </TabsTrigger>
            <TabsTrigger value="crossfade" className="text-xs">
              Crossfade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="speed" className="space-y-4 pt-4">
            <div>
              <Label className="text-zinc-300 text-sm mb-3 block">Playback Speed</Label>
              <div className="flex items-center gap-2 mb-3">
                <Slider
                  value={[playbackRate]}
                  min={0.5}
                  max={2}
                  step={0.05}
                  onValueChange={(v) => onPlaybackRateChange(v[0])}
                  className="flex-1"
                />
                <span className="text-emerald-400 font-medium min-w-[3rem] text-right">
                  {playbackRate.toFixed(2)}x
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {speedPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={playbackRate === preset.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPlaybackRateChange(preset.value)}
                    className={playbackRate === preset.value ? "bg-emerald-600 hover:bg-emerald-700" : "border-zinc-700"}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="equalizer" className="space-y-4 pt-4">
            <div>
              <Label className="text-zinc-300 text-sm mb-3 block">Equalizer Presets</Label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.entries(eqPresets).map(([name, values]) => (
                  <Button
                    key={name}
                    variant="outline"
                    size="sm"
                    onClick={() => onEqChange(values)}
                    className="border-zinc-700 capitalize"
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {eqBands.map((band) => (
                <div key={band.id}>
                  <div className="flex justify-between mb-1">
                    <Label className="text-zinc-400 text-xs">{band.label}</Label>
                    <span className="text-emerald-400 text-xs font-medium">
                      {eqSettings[band.id] > 0 ? '+' : ''}{eqSettings[band.id]} dB
                    </span>
                  </div>
                  <Slider
                    value={[eqSettings[band.id]]}
                    min={-12}
                    max={12}
                    step={1}
                    onValueChange={(v) => onEqChange({ ...eqSettings, [band.id]: v[0] })}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="crossfade" className="space-y-4 pt-4">
            <div>
              <Label className="text-zinc-300 text-sm mb-3 block">Crossfade Duration</Label>
              <div className="flex items-center gap-2 mb-2">
                <Slider
                  value={[crossfadeDuration]}
                  min={0}
                  max={12}
                  step={1}
                  onValueChange={(v) => onCrossfadeDurationChange(v[0])}
                  className="flex-1"
                />
                <span className="text-emerald-400 font-medium min-w-[3rem] text-right">
                  {crossfadeDuration}s
                </span>
              </div>
              <p className="text-zinc-500 text-xs">
                {crossfadeDuration === 0 
                  ? 'Crossfade disabled' 
                  : `Songs will blend for ${crossfadeDuration} seconds`}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}