'use client'

import type { Episode } from '@/types/episode'
import { convertDateString } from '@/utils/convert-date-string'
import { convertDurationToTimeStringShort } from '@/utils/convert-duration-time-string'
import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePlayer } from './player-provider'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface LastEpisodesProps {
  latestEpisodes: Episode[]
}

export function LastEpisodes({ latestEpisodes }: Readonly<LastEpisodesProps>) {
  const { play } = usePlayer()

  const handlePlay = (episode: Episode) => {
    if (!episode?.link) {
      console.error('Episódio inválido:', episode)
      return
    }

    play(episode)
  }

  return (
    <section className="px-4 md:px-8 py-6">
      <h2 className="text-xl font-semibold mb-4">Últimos Lançamentos</h2>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {latestEpisodes.map(episode => (
          <Card key={episode.id} className="hover:bg-muted transition-colors">
            <CardHeader className="flex flex-row gap-4 items-center">
              <Image
                src={episode.image}
                alt={episode.title}
                width={72}
                height={72}
                className="rounded object-cover"
              />
              <div>
                <Link
                  href={`/episode/${episode.id}`}
                  className="hover:underline"
                >
                  <CardTitle className="text-base">{episode.title}</CardTitle>
                </Link>
                <p className="text-sm text-muted-foreground">{episode.host}</p>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex flex-col text-xs text-muted-foreground">
                <span>{convertDateString(episode.date)}</span>
                <span>
                  {convertDurationToTimeStringShort(episode.duration)}
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-primary/20"
                onClick={() => handlePlay(episode)}
              >
                <Play className="w-4 h-4 text-primary" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
