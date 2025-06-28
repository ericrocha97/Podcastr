import type { Metadata } from 'next';
import Link from 'next/link';
import { EpisodeDetails } from '@/components/episode-details';
import { Button } from '@/components/ui/button';
import type { Episode } from '@/types/episode';

interface EpisodePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EpisodePageProps): Promise<Metadata> {
  const { id } = await params;
  const episode = await getEpisodeData(id);

  if (!episode) {
    return {
      title: 'Episódio não encontrado | Podcastr',
      description:
        'O episódio que você está procurando não existe ou foi removido.',
    };
  }

  return {
    title: `${episode.title} | Podcastr`,
    description: episode.description.substring(0, 160),
  };
}

const trailingSlashRegex = /\/$/;

async function getEpisodeData(id: string): Promise<Episode | null> {
  try {
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer
      ? (process.env.NEXT_PUBLIC_BASE_URL?.replace(trailingSlashRegex, '') ??
        'http://localhost:3000')
      : '';
    const url = `${baseUrl}/api/rss/episode/${id}`;
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 }, // Revalidate once a day
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch episode data');
    }

    const data = await response.json();
    return data.episode;
  } catch (error) {
    //biome-ignore lint/suspicious/noConsole: console.error
    console.error('Erro ao processar resposta da API RSS:', error);
    return null;
  }
}

export default async function Page({ params }: Readonly<EpisodePageProps>) {
  const { id } = await params;
  const episode = await getEpisodeData(id);

  return (
    <main className="pb-28 lg:flex-1 lg:overflow-y-auto lg:pb-0">
      <div className="p-4 md:p-8">
        {episode ? (
          <EpisodeDetails episode={episode} />
        ) : (
          <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
            <h1 className="mb-4 font-bold text-2xl">Episódio não encontrado</h1>
            <p className="mb-6 text-muted-foreground">
              O episódio que você está procurando não existe ou foi removido.
            </p>
            <Button asChild>
              <Link href="/">Voltar para a Home</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
