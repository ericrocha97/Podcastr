import type { ApiEpisode } from '@/types/api-episode';
import type { Episode } from '@/types/episode';
import { convertGuidToId } from '@/utils/convert-guid-to-id';

const apiUrl = process.env.API_RSS;

async function fetchEpisodes(): Promise<ApiEpisode[]> {
  if (!apiUrl) throw new Error('API_RSS não definida no .env');
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error('Erro ao buscar dados da API RSS');
  const data = await response.json();
  return data.items as ApiEpisode[];
}

export async function getLatestEpisodes(): Promise<Episode[]> {
  const items = await fetchEpisodes();
  return items
    .toSorted((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 3)
    .map((item) => {
      const id = convertGuidToId(item.guid);
      return {
        id,
        title: item.title,
        host: item.author,
        image: item.thumbnail,
        date: item.pubDate,
        duration: item.enclosure.duration,
        link: item.enclosure.link,
        description: item.description ?? item.content ?? 'No description available.',
      };
    });
}

export async function getAllEpisodes(): Promise<Episode[]> {
  const items = await fetchEpisodes();
  return items
    .toSorted((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(3)
    .map((item) => {
      const id = convertGuidToId(item.guid);
      return {
        id,
        title: item.title,
        host: item.author,
        image: item.thumbnail,
        date: item.pubDate,
        duration: item.enclosure.duration,
        link: item.enclosure.link,
        description: item.description ?? item.content ?? 'No description available.',
      };
    });
}
