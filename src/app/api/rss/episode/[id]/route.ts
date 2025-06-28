import { type NextRequest, NextResponse } from 'next/server';

import { getEpisodeById } from '@/lib/episodes';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const episode = await getEpisodeById(id);
    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }
    return NextResponse.json({ episode });
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
