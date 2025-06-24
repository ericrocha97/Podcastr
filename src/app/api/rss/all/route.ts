import type { ApiEpisode } from '@/types/api-episode'
import type { Episode } from '@/types/episode'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_RSS
  if (!apiUrl) {
    return NextResponse.json(
      { error: 'API_RSS não definida no .env' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao buscar dados da API RSS' },
        { status: 502 }
      )
    }
    const data = await response.json()
    const { items } = data
    const allEpisodes: Episode[] = (items as ApiEpisode[])
      .toSorted(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      )
      .slice(3)
      .map(item => {
        const match = /[^/]+$/.exec(item.guid)
        const id = match ? match[0] : item.guid
        return {
          id,
          title: item.title,
          host: item.author,
          image: item.thumbnail,
          date: item.pubDate,
          duration: item.enclosure.duration,
          link: item.enclosure.link,
          description:
            item.description ?? item.content ?? 'No description available.',
        }
      })
    return NextResponse.json({ allEpisodes })
  } catch (error) {
    console.error('Erro ao processar resposta da API RSS:', error)
    return NextResponse.json(
      { error: 'Erro ao processar resposta da API RSS' },
      { status: 500 }
    )
  }
}
