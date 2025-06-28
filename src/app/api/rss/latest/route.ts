import { type NextRequest, NextResponse } from 'next/server';
import { getLatestEpisodes } from '@/lib/episodes';

export async function GET(_req: NextRequest) {
  try {
    const latestEpisodes = await getLatestEpisodes();
    return NextResponse.json({ latestEpisodes });
  } catch (error) {
    //biome-ignore lint/suspicious/noConsole: console.error
    console.error('Erro ao processar resposta da API RSS:', error);
    return NextResponse.json(
      {
        error: `Erro ao processar resposta da API RSS: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    );
  }
}
