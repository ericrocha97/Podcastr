'use client';
import {
  FastForward,
  Pause,
  Play,
  Rewind,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { convertDurationToTimeString } from '@/utils/convert-duration-time-string';
import { usePlayer } from './player-provider';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState,
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const audio = audioRef.current;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          //biome-ignore lint/suspicious/noConsole: console.error
          console.error('Error playing audio:', error);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!(episode && audioRef.current)) {
      return;
    }

    const audio = audioRef.current;
    const currentSrc = audio.src;
    const newSrc = episode.link;

    if (currentSrc !== newSrc) {
      setProgress(0);
      setDuration(Number(episode.duration) || 0);

      const handleCanPlay = () => {
        if (isPlaying) {
          audio.play();
        }
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.src = newSrc;

      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [episode, isPlaying]);

  function handleTimeUpdate() {
    if (!audioRef.current) {
      return;
    }
    setProgress(audioRef.current.currentTime);
  }

  function handleSliderChange(value: number[]) {
    if (!audioRef.current) {
      return;
    }
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  }

  function handleFastForward() {
    if (!audioRef.current) {
      return;
    }
    const newTime = Math.min(audioRef.current.currentTime + 10, duration);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  }

  function handleRewind() {
    if (!audioRef.current) {
      return;
    }
    const newTime = Math.max(audioRef.current.currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) {
      return;
    }
    setDuration(audioRef.current.duration);
  }

  return (
    <aside className="fixed right-0 bottom-0 left-0 z-20 flex h-24 items-center justify-between gap-4 border-border border-t bg-card px-4 lg:relative lg:h-screen lg:w-[420px] lg:flex-col lg:justify-start lg:border-t-0 lg:border-l lg:p-6">
      {episode ? (
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:flex-initial lg:flex-col lg:pt-10">
          <Image
            alt={episode.title}
            className="h-14 w-14 flex-shrink-0 rounded object-cover lg:h-64 lg:w-64"
            height={256}
            src={episode.image}
            width={256}
          />
          <div className="min-w-0 flex-1 lg:mt-4 lg:flex-initial lg:text-center">
            <div className="relative w-full overflow-hidden lg:w-64">
              <Link className="hover:underline" href={`/episode/${episode.id}`}>
                <h3
                  className="animate-marquee whitespace-nowrap font-medium text-sm lg:text-base"
                  style={{
                    animationDuration: episode.title.length > 30 ? '10s' : '0s',
                    animationPlayState:
                      episode.title.length > 30 ? 'running' : 'paused',
                  }}
                  title={episode.title}
                >
                  {episode.title}
                </h3>
              </Link>
              <style>{`
                @keyframes marquee {
                  0% {
                    transform: translateX(0%);
                  }
                  100% {
                    transform: translateX(-100%);
                  }
                }
                .animate-marquee {
                  display: inline-block;
                  min-width: 100%;
                  animation-name: marquee;
                  animation-timing-function: linear;
                  animation-iteration-count: infinite;
                }
              `}</style>
            </div>
            <p className="hidden text-muted-foreground text-sm lg:block">
              {episode.host}
            </p>
            <p className="hidden text-muted-foreground text-xs lg:block">
              {episode
                ? `${currentEpisodeIndex + 1} / ${episodeList.length}`
                : '-'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:flex-initial lg:flex-col lg:pt-10">
          <Image
            alt="Selecione um podcast"
            className="h-14 w-14 flex-shrink-0 rounded object-cover lg:h-64 lg:w-64"
            height={256}
            priority
            src="/placeholder.jpg"
            width={256}
          />
          <div className="min-w-0 flex-1 lg:mt-4 lg:flex-initial lg:text-center">
            <h3 className="font-medium text-sm lg:text-base">
              Selecione um podcast
            </h3>
            <p className="hidden text-muted-foreground text-sm lg:block">-</p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center lg:mb-8 lg:w-full lg:space-y-6">
        {episode?.link && (
          <audio
            autoPlay
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={handleLoadedMetadata}
            onPause={() => setPlayingState(false)}
            onPlay={() => setPlayingState(true)}
            onTimeUpdate={handleTimeUpdate}
            preload="metadata"
            ref={audioRef}
            src={episode.link}
          >
            <track kind="captions" />
          </audio>
        )}

        <div className="hidden w-full space-y-2 lg:block">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              {convertDurationToTimeString(String(Math.floor(progress)))}
            </span>
            <span className="text-muted-foreground text-sm">
              {convertDurationToTimeString(String(Math.floor(duration)))}
            </span>
          </div>
          {episode && (
            <Slider
              className="w-full"
              max={duration}
              onValueChange={handleSliderChange}
              step={1}
              value={[progress]}
            />
          )}
        </div>

        <div className="flex items-center justify-center gap-1 lg:gap-4">
          <Button
            className="h-8 w-8 rounded-full hover:bg-primary/20 lg:h-10 lg:w-10"
            disabled={!(episode && hasPrevious)}
            onClick={playPrevious}
            size="icon"
            title="Anterior"
            variant="ghost"
          >
            <SkipBack className="h-4 w-4 text-muted-foreground lg:h-5 lg:w-5" />
          </Button>
          <Button
            className="h-8 w-8 rounded-full hover:bg-primary/20 lg:h-10 lg:w-10"
            disabled={!episode}
            onClick={handleRewind}
            size="icon"
            title="Voltar 10 segundos"
            variant="ghost"
          >
            <Rewind className="h-4 w-4 text-muted-foreground lg:h-5 lg:w-5" />
          </Button>
          <Button
            className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 lg:h-12 lg:w-12"
            disabled={!episode}
            onClick={togglePlay}
            size="icon"
            title={isPlaying ? 'Pausar' : 'Tocar'}
            variant="default"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-primary-foreground lg:h-6 lg:w-6" />
            ) : (
              <Play className="h-4 w-4 text-primary-foreground lg:h-6 lg:w-6" />
            )}
          </Button>
          <Button
            className="h-8 w-8 rounded-full hover:bg-primary/20 lg:h-10 lg:w-10"
            disabled={!episode}
            onClick={handleFastForward}
            size="icon"
            title="Avançar 10 segundos"
            variant="ghost"
          >
            <FastForward className="h-4 w-4 text-muted-foreground lg:h-5 lg:w-5" />
          </Button>
          <Button
            className="h-8 w-8 rounded-full hover:bg-primary/20 lg:h-10 lg:w-10"
            disabled={!(episode && hasNext)}
            onClick={playNext}
            size="icon"
            title="Próximo"
            variant="ghost"
          >
            <SkipForward className="h-4 w-4 text-muted-foreground lg:h-5 lg:w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
