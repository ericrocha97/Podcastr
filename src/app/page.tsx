import { Header } from '@/components/header'
import { Player } from '@/components/player'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { convertDateString } from '@/src/utils/convert-date-string'
import { convertDurationToTimeStringShort } from '@/src/utils/convert-duration-time-string'
import { Play } from 'lucide-react'
import Image from 'next/image'

interface Episode {
  id: string
  title: string
  host: string
  image: string
  date: string
  duration: string
  link: string
}

export default async function Home() {
  const [latestEpisodesResponse, allEpisodesResponse] = await Promise.all([
    fetch('http://localhost:3000/api/rss/latest', {
      next: {
        revalidate: 60 * 60 * 24, // 1 dia
      },
    }),
    fetch('http://localhost:3000/api/rss/all', {
      next: {
        revalidate: 60 * 60 * 24, // 1 dia
      },
    }),
  ])
  const latestEpisodesData = await latestEpisodesResponse.json()
  const allEpisodesData = await allEpisodesResponse.json()

  const latestEpisodes: Episode[] = latestEpisodesData.latestEpisodes
  const allEpisodes: Episode[] = allEpisodesData.allEpisodes

  return (
    <div className="lg:flex lg:h-screen lg:overflow-hidden bg-background">
      <div className="lg:flex-1 lg:flex lg:flex-col">
        <Header />
        <main className="pb-28 lg:pb-0 lg:flex-1 lg:overflow-y-auto">
          <section className="px-4 md:px-8 py-6">
            <h2 className="text-xl font-semibold mb-4">Últimos Lançamentos</h2>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              }}
            >
              {latestEpisodes.map(podcast => (
                <Card
                  key={podcast.id}
                  className="hover:bg-muted transition-colors"
                >
                  <CardHeader className="flex flex-row gap-4 items-center">
                    <Image
                      src={podcast.image}
                      alt={podcast.title}
                      width={72}
                      height={72}
                      className="rounded object-cover"
                    />
                    <div>
                      <CardTitle className="text-base">
                        {podcast.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {podcast.host}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span>{convertDateString(podcast.date)}</span>
                      <span>
                        {convertDurationToTimeStringShort(podcast.duration)}
                      </span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full hover:bg-primary/20"
                    >
                      <Play className="w-4 h-4 text-primary" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="px-4 md:px-8 py-6">
            <h2 className="text-xl font-semibold mb-4">Todos os episódios</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <TableHead>Podcast</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Integrantes
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Data</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Duração
                  </TableHead>
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
                      {episode.title}
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
                      >
                        <Play className="w-4 h-4 text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </main>
      </div>
      <Player />
    </div>
  )
}
