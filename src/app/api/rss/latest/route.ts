import { type NextRequest, NextResponse } from 'next/server'

import db from '../../../../../db.json'

export async function GET(req: NextRequest) {
  const { items } = db
  const latestEpisodes = items
    .toSorted(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    )
    .slice(0, 3)
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
      }
    })

  return NextResponse.json({
    latestEpisodes,
  })
}
