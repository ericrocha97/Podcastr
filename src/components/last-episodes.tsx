'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Episode } from '@/types/episode';
import { convertDateString } from '@/utils/convert-date-string';
import { convertDurationToTimeStringShort } from '@/utils/convert-duration-time-string';
import { usePlayer } from './player-provider';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LastEpisodesProps {
  latestEpisodes: Episode[];
}

export function LastEpisodes({ latestEpisodes }: Readonly<LastEpisodesProps>) {
  const { play } = usePlayer();

  const handlePlay = (episode: Episode) => {
    if (!episode?.link) {
      //biome-ignore lint/suspicious/noConsole: console.error
      console.error('Episódio inválido:', episode);
      return;
    }

    play(episode);
  };

  return (
    <section className="px-4 py-6 md:px-8">
      <h2 className="mb-4 font-semibold text-xl">Últimos Lançamentos</h2>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {latestEpisodes.map((episode) => (
          <Card className="transition-colors hover:bg-muted" key={episode.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Image
                alt={episode.title}
                className="rounded object-cover"
                height={72}
                src={episode.image}
                width={72}
              />
              <div>
                <Link
                  className="hover:underline"
                  href={`/episode/${episode.id}`}
                >
                  <CardTitle className="text-base">{episode.title}</CardTitle>
                </Link>
                <p className="text-muted-foreground text-sm">{episode.host}</p>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex flex-col text-muted-foreground text-xs">
                <span>{convertDateString(episode.date)}</span>
                <span>
                  {convertDurationToTimeStringShort(episode.duration)}
                </span>
              </div>
              <Button
                className="rounded-full hover:bg-primary/20"
                onClick={() => handlePlay(episode)}
                size="icon"
                variant="ghost"
              >
                <Play className="h-4 w-4 text-primary" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
