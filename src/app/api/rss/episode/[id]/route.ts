import { type NextRequest, NextResponse } from 'next/server'

import type { ApiEpisode } from '@/types/api-episode'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
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
    const foundItem = (items as ApiEpisode[]).find(item => {
      const match = /[^/]+$/.exec(item.guid)
      const itemId = match ? match[0] : item.guid
      return itemId === id
    })

    if (!foundItem) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 })
    }

    const episode = {
      id: id,
      title: foundItem.title,
      host: foundItem.author,
      image: foundItem.thumbnail,
      date: foundItem.pubDate,
      duration: foundItem.enclosure.duration,
      link: foundItem.enclosure.link,
      description:
        foundItem.description ??
        foundItem.content ??
        'No description available.',
    }

    return NextResponse.json({ episode })
  } catch (error) {
    console.error('Erro ao processar resposta da API RSS:', error)
    return NextResponse.json(
      { error: 'Erro ao processar resposta da API RSS' },
      { status: 500 }
    )
  }
}
