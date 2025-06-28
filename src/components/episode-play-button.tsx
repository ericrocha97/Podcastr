'use client';

import { Play } from 'lucide-react';
import type { Episode } from '@/types/episode';
import { usePlayer } from './player-provider';
import { Button } from './ui/button';

interface EpisodePlayButtonProps {
  episode: Episode;
  variant?: 'default' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function EpisodePlayButton({
  episode,
  variant = 'default',
  size = 'default',
  className,
}: Readonly<EpisodePlayButtonProps>) {
  const { playList } = usePlayer();

  const handlePlay = () => {
    if (!episode?.link) {
      //biome-ignore lint/suspicious/noConsole: console.error
      console.error('Episódio inválido:', episode);
      return;
    }
    playList([episode], 0);
  };

  return (
    <Button
      className={className}
      onClick={handlePlay}
      size={size}
      variant={variant}
    >
      <Play className="mr-2 h-4 w-4" />
      Tocar episódio
    </Button>
  );
}
