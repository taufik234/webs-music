import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

interface Song {
  id: string;
  title: string;
  artist: string;
  cover_url: string | null;
  audio_url: string;
  duration: number | null;
}

interface MusicPlayerProps {
  currentSong: Song | null;
  playlist: Song[];
  onNext: () => void;
  onPrevious: () => void;
}

const MusicPlayer = ({ currentSong, playlist, onNext, onPrevious }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audio_url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-4 z-50">
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={onNext} onLoadedMetadata={handleTimeUpdate} />

      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img src={currentSong.cover_url || "/placeholder.svg"} alt={currentSong.title} className="w-14 h-14 rounded-lg object-cover shadow-lg" />
            <div className="min-w-0">
              <p className="font-semibold truncate">{currentSong.title}</p>
              <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsShuffle(!isShuffle)} className={isShuffle ? "text-primary" : "text-muted-foreground"}>
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onPrevious}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button size="sm" onClick={togglePlay} className="bg-gradient-primary hover:opacity-90 transition-opacity w-10 h-10 rounded-full">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onNext}>
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsRepeat(!isRepeat)} className={isRepeat ? "text-primary" : "text-muted-foreground"}>
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
              <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} className="flex-1" />
              <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <Slider value={[volume * 100]} max={100} step={1} onValueChange={(value) => setVolume(value[0] / 100)} className="w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
