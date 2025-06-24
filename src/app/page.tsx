import { AllEpisodes } from '@/components/all-episodes'
import { LastEpisodes } from '@/components/last-episodes'
import type { Episode } from '@/types/episode'

export default async function Home() {
  const isServer = typeof window === 'undefined'
  const baseUrl = isServer
    ? (process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ??
      'http://localhost:3000')
    : ''

  const [latestEpisodesResponse, allEpisodesResponse] = await Promise.all([
    fetch(`${baseUrl}/api/rss/latest`, {
      next: {
        revalidate: 60 * 60 * 24, // 1 dia
      },
    }),
    fetch(`${baseUrl}/api/rss/all`, {
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
    <main className="pb-28 lg:pb-0 lg:flex-1 lg:overflow-y-auto">
      <LastEpisodes latestEpisodes={latestEpisodes} />

      <AllEpisodes allEpisodes={allEpisodes} />
    </main>
  )
}
