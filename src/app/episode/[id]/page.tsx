import { EpisodeDetails } from '@/components/episode-details'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EpisodePageProps {
  params: Promise<{
    id: string
  }>
}

async function getEpisodeData(id: string): Promise<Episode | null> {
  try {
    const response = await fetch(
      `http://localhost:3000/api/rss/episode/${id}`,
      {
        next: { revalidate: 60 * 60 * 24 }, // Revalidate once a day
      }
    )

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch episode data')
    }

    const data = await response.json()
    return data.episode
  } catch (error) {
    console.error('Error fetching episode:', error)
    return null
  }
}

export default async function Page({ params }: Readonly<EpisodePageProps>) {
  const { id } = await params
  const episode = await getEpisodeData(id)

  return (
    <main className="pb-28 lg:pb-0 lg:flex-1 lg:overflow-y-auto">
      <div className="p-4 md:p-8">
        {episode ? (
          <EpisodeDetails episode={episode} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
            <h1 className="text-2xl font-bold mb-4">Episódio não encontrado</h1>
            <p className="text-muted-foreground mb-6">
              O episódio que você está procurando não existe ou foi removido.
            </p>
            <Button asChild>
              <Link href="/">Voltar para a Home</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
