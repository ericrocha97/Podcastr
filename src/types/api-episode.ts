export interface ApiEpisode {
  guid: string
  title: string
  author: string
  thumbnail: string
  pubDate: string
  description?: string
  content?: string
  enclosure: {
    duration: string
    link: string
  }
}
