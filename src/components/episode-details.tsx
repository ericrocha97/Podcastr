'use client';

import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Episode } from '@/types/episode';
import { convertDateString } from '@/utils/convert-date-string';
import { convertDurationToTimeStringShort } from '@/utils/convert-duration-time-string';
import { EpisodePlayButton } from './episode-play-button';
import { Button } from './ui/button';

interface EpisodeDetailsProps {
  episode: Episode;
}

export function EpisodeDetails({ episode }: Readonly<EpisodeDetailsProps>) {
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <div className="relative mb-8 aspect-video max-h-[400px] w-full">
        <Image
          alt={episode.title}
          className="rounded-lg object-cover"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={episode.image}
        />
        <div className="absolute right-4 bottom-4 left-4 flex justify-between">
          <Button asChild size="lg" variant="secondary">
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <EpisodePlayButton episode={episode} size="lg" variant="secondary" />
        </div>
      </div>

      <h1 className="mb-4 font-bold text-2xl">{episode.title}</h1>

      <div className="mb-6 flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
        <span>{episode.host}</span>
        <span>{convertDateString(episode.date)}</span>
        <span>{convertDurationToTimeStringShort(episode.duration)}</span>
      </div>

      <hr className="mb-6 border-border" />

      <div
        className="prose dark:prose-invert max-w-none text-muted-foreground"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: porque o conteúdo é sanitizado no backend
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}
