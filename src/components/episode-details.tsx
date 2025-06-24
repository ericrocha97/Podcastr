'use client'

import type { Episode } from '@/types/episode'
import { convertDateString } from '@/utils/convert-date-string'
import { convertDurationToTimeStringShort } from '@/utils/convert-duration-time-string'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { EpisodePlayButton } from './episode-play-button'
import { Button } from './ui/button'

interface EpisodeDetailsProps {
  episode: Episode
}

export function EpisodeDetails({ episode }: Readonly<EpisodeDetailsProps>) {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative aspect-video w-full mb-8 max-h-[400px]">
        <Image
          src={episode.image}
          alt={episode.title}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          <Button asChild variant="secondary" size="lg">
            <Link href="/">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <EpisodePlayButton episode={episode} variant="secondary" size="lg" />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">{episode.title}</h1>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
        <span>{episode.host}</span>
        <span>{convertDateString(episode.date)}</span>
        <span>{convertDurationToTimeStringShort(episode.duration)}</span>
      </div>

      <hr className="border-border mb-6" />

      <div
        className="text-muted-foreground prose dark:prose-invert max-w-none"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: porque o conteúdo é sanitizado no backend
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}
