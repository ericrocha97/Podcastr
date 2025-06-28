'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Episode } from '@/types/episode';
import { convertDateString } from '@/utils/convert-date-string';
import { convertDurationToTimeStringShort } from '@/utils/convert-duration-time-string';
import { usePlayer } from './player-provider';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface AllEpisodesProps {
  allEpisodes: Episode[];
}

export function AllEpisodes({ allEpisodes }: Readonly<AllEpisodesProps>) {
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
      <h2 className="mb-4 font-semibold text-xl">Todos os episódios</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Podcast</TableHead>
            <TableHead className="hidden md:table-cell">Integrantes</TableHead>
            <TableHead className="hidden lg:table-cell">Data</TableHead>
            <TableHead className="hidden xl:table-cell">Duração</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {allEpisodes.map((episode) => (
            <TableRow className="hover:bg-muted/50" key={episode.id}>
              <TableCell>
                <Image
                  alt={episode.title}
                  className="rounded object-cover"
                  height={64}
                  src={episode.image}
                  width={64}
                />
              </TableCell>
              <TableCell className="max-w-xs whitespace-normal break-words font-medium">
                <Link
                  className="hover:underline"
                  href={`/episode/${episode.id}`}
                >
                  {episode.title}
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {episode.host}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {convertDateString(episode.date)}
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                {convertDurationToTimeStringShort(episode.duration)}
              </TableCell>
              <TableCell>
                <Button
                  className="rounded-lg hover:bg-primary/20"
                  onClick={() => handlePlay(episode)}
                  size="icon"
                  variant="ghost"
                >
                  <Play className="h-4 w-4 text-primary" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
