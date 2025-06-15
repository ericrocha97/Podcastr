import { Header } from '@/components/header'
import { Player } from '@/components/player'
import { Button } from '@/components/ui/button'
import { convertDateString } from '@/src/utils/convert-date-string'
import { convertDurationToTimeStringShort } from '@/src/utils/convert-duration-time-string'
import { ChevronLeft, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Episode {
  id: string
  title: string
  host: string
  image: string
  date: string
  duration: string
  link: string
  description: string
}

interface EpisodePageProps {
  params: {
    id: string
  }
}

async function getEpisodeData(id: string): Promise<Episode | null> {
  const response = await fetch(`http://localhost:3000/api/rss/episode/${id}`, {
    next: { revalidate: 60 * 60 * 24 }, // Revalidate once a day
  })

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error('Failed to fetch episode data')
  }
  const data = await response.json()
  return data.episode
}

export default async function EpisodePage({
  params,
}: Readonly<EpisodePageProps>) {
  const episode = await getEpisodeData(params.id)

  return (
    <div className="lg:flex lg:h-screen lg:overflow-hidden bg-background">
      <div className="lg:flex-1 lg:flex lg:flex-col">
        <Header />
        <main className="pb-28 lg:pb-0 lg:flex-1 lg:overflow-y-auto">
          <div className="p-4 md:p-8">
            {episode ? (
              <div className="relative w-full max-w-4xl mx-auto">
                <div className="relative aspect-video w-full mb-8 max-h-[400px]">
                  <Image
                    src={episode.image || '/placeholder.jpg'}
                    alt={episode.title}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <Button asChild variant="secondary" size="lg">
                      <Link href="/">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Voltar
                      </Link>
                    </Button>
                    <Button variant="secondary" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      Tocar episódio
                    </Button>
                  </div>
                </div>

                <h1 className="text-2xl font-bold mb-4">{episode.title}</h1>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
                  <span>{episode.host}</span>
                  <span>{convertDateString(episode.date)}</span>
                  <span>
                    {convertDurationToTimeStringShort(episode.duration)}
                  </span>
                </div>

                <hr className="border-border mb-6" />

                <div
                  className="text-muted-foreground prose dark:prose-invert max-w-none"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{ __html: episode.description }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
                <h1 className="text-2xl font-bold mb-4">
                  Episódio não encontrado
                </h1>
                <p className="text-muted-foreground mb-6">
                  O episódio que você está procurando não existe ou foi
                  removido.
                </p>
                <Button asChild>
                  <Link href="/">Voltar para a Home</Link>
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
      <Player />
    </div>
  )
}
