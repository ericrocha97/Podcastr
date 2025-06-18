'use client'

import { convertDateString } from '@/utils/convert-date-string'
import { convertDurationToTimeStringShort } from '@/utils/convert-duration-time-string'
import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePlayer } from './player-provider'
import { Button } from './ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

interface AllEpisodesProps {
  allEpisodes: Episode[]
}

export function AllEpisodes({ allEpisodes }: Readonly<AllEpisodesProps>) {
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
      <h2 className="text-xl font-semibold mb-4">Todos os episódios</h2>

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
          {allEpisodes.map(episode => (
            <TableRow key={episode.id} className="hover:bg-muted/50">
              <TableCell>
                <Image
                  src={episode.image}
                  alt={episode.title}
                  width={64}
                  height={64}
                  className="rounded object-cover"
                />
              </TableCell>
              <TableCell className="font-medium break-words whitespace-normal max-w-xs">
                <Link
                  href={`/episode/${episode.id}`}
                  className="hover:underline"
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
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-primary/20"
                  onClick={() => handlePlay(episode)}
                >
                  <Play className="w-4 h-4 text-primary" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
