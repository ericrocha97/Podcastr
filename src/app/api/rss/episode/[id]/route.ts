import { type NextRequest, NextResponse } from 'next/server'

import db from '../../../../../../db.json'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestedId = params.id

  const { items } = db
  const foundItem = items.find(item => {
    const match = /[^/]+$/.exec(item.guid)
    const itemId = match ? match[0] : item.guid
    return itemId === requestedId
  })

  if (!foundItem) {
    return NextResponse.json({ error: 'Episode not found' }, { status: 404 })
  }

  const episode = {
    id: requestedId,
    title: foundItem.title,
    host: foundItem.author,
    image: foundItem.thumbnail,
    date: foundItem.pubDate,
    duration: foundItem.enclosure.duration,
    link: foundItem.enclosure.link,
    description:
      foundItem.description || foundItem.content || 'No description available.',
  }

  return NextResponse.json({
    episode,
  })
}
