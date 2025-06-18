'use client'

import { Play } from 'lucide-react'
import { usePlayer } from './player-provider'
import { Button } from './ui/button'

interface EpisodePlayButtonProps {
  episode: Episode
  variant?: 'default' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function EpisodePlayButton({
  episode,
  variant = 'default',
  size = 'default',
  className,
}: Readonly<EpisodePlayButtonProps>) {
  const { playList } = usePlayer()

  const handlePlay = () => {
    if (!episode?.link) {
      console.error('Episódio inválido:', episode)
      return
    }
    playList([episode], 0)
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handlePlay}
    >
      <Play className="w-4 h-4 mr-2" />
      Tocar episódio
    </Button>
  )
}
