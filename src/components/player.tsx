'use client'
import { convertDurationToTimeString } from '@/utils/convert-duration-time-string'
import {
  FastForward,
  Pause,
  Play,
  Rewind,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from './player-provider'
import { Button } from './ui/button'
import { Slider } from './ui/slider'

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

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
  } = usePlayer()

  const episode = episodeList[currentEpisodeIndex]

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {})
      }
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (!episode || !audioRef.current) return

    const audio = audioRef.current
    const currentSrc = audio.src
    const newSrc = episode.link

    if (currentSrc !== newSrc) {
      setProgress(0)
      setDuration(Number(episode.duration) || 0)

      const handleCanPlay = () => {
        if (isPlaying) {
          audio.play()
        }
      }

      audio.addEventListener('canplay', handleCanPlay)
      audio.src = newSrc

      return () => {
        audio.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [episode, isPlaying])

  function handleTimeUpdate() {
    if (!audioRef.current) return
    setProgress(audioRef.current.currentTime)
  }

  function handleSliderChange(value: number[]) {
    if (!audioRef.current) return
    const newTime = value[0]
    audioRef.current.currentTime = newTime
    setProgress(newTime)
  }

  function handleFastForward() {
    if (!audioRef.current) return
    const newTime = Math.min(audioRef.current.currentTime + 10, duration)
    audioRef.current.currentTime = newTime
    setProgress(newTime)
  }

  function handleRewind() {
    if (!audioRef.current) return
    const newTime = Math.max(audioRef.current.currentTime - 10, 0)
    audioRef.current.currentTime = newTime
    setProgress(newTime)
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  return (
    <aside
      className="
        fixed bottom-0 left-0 right-0 h-24 bg-card border-t border-border z-20
        flex items-center justify-between px-4 gap-4
        lg:relative lg:flex-col lg:w-[420px] lg:h-screen lg:border-l lg:border-t-0 lg:p-6 lg:justify-start"
    >
      {episode ? (
        <div className="flex items-center gap-3 lg:flex-col lg:pt-10 min-w-0 flex-1 lg:flex-initial">
          <Image
            src={episode.image}
            alt={episode.title}
            width={256}
            height={256}
            className="w-14 h-14 rounded object-cover lg:w-64 lg:h-64 flex-shrink-0"
          />
          <div className="lg:mt-4 lg:text-center min-w-0 flex-1 lg:flex-initial">
            <div className="relative w-full lg:w-64 overflow-hidden">
              <Link href={`/episode/${episode.id}`} className="hover:underline">
                <h3
                  className="font-medium whitespace-nowrap animate-marquee text-sm lg:text-base"
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
            <p className="text-sm text-muted-foreground hidden lg:block">
              {episode.host}
            </p>
            <p className="text-xs text-muted-foreground hidden lg:block">
              {episode
                ? `${currentEpisodeIndex + 1} / ${episodeList.length}`
                : '-'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 lg:flex-col lg:pt-10 min-w-0 flex-1 lg:flex-initial">
          <Image
            src="/placeholder.jpg"
            alt="Selecione um podcast"
            width={256}
            height={256}
            priority
            className="w-14 h-14 rounded object-cover lg:w-64 lg:h-64 flex-shrink-0"
          />
          <div className="lg:mt-4 lg:text-center min-w-0 flex-1 lg:flex-initial">
            <h3 className="font-medium text-sm lg:text-base">
              Selecione um podcast
            </h3>
            <p className="text-sm text-muted-foreground hidden lg:block">-</p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center lg:w-full lg:space-y-6 lg:mb-8">
        {episode?.link && (
          <audio
            src={episode.link}
            ref={audioRef}
            preload="metadata"
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEpisodeEnded}
            autoPlay
          >
            <track kind="captions" />
          </audio>
        )}

        <div className="hidden lg:block w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {convertDurationToTimeString(String(Math.floor(progress)))}
            </span>
            <span className="text-sm text-muted-foreground">
              {convertDurationToTimeString(String(Math.floor(duration)))}
            </span>
          </div>
          {episode && (
            <Slider
              value={[progress]}
              max={duration}
              step={1}
              className="w-full"
              onValueChange={handleSliderChange}
            />
          )}
        </div>

        <div className="flex items-center justify-center gap-1 lg:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20 w-8 h-8 lg:w-10 lg:h-10"
            onClick={playPrevious}
            disabled={!episode || !hasPrevious}
            title="Anterior"
          >
            <SkipBack className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20 w-8 h-8 lg:w-10 lg:h-10"
            disabled={!episode}
            onClick={handleRewind}
            title="Voltar 10 segundos"
          >
            <Rewind className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="rounded-full w-9 h-9 lg:w-12 lg:h-12 bg-primary hover:bg-primary/90"
            disabled={!episode}
            onClick={togglePlay}
            title={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 lg:w-6 lg:h-6 text-primary-foreground" />
            ) : (
              <Play className="w-4 h-4 lg:w-6 lg:h-6 text-primary-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20 w-8 h-8 lg:w-10 lg:h-10"
            disabled={!episode}
            onClick={handleFastForward}
            title="Avançar 10 segundos"
          >
            <FastForward className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20 w-8 h-8 lg:w-10 lg:h-10"
            onClick={playNext}
            disabled={!episode || !hasNext}
            title="Próximo"
          >
            <SkipForward className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
