import { AllEpisodes } from '@/components/all-episodes';
import { LastEpisodes } from '@/components/last-episodes';
import { getAllEpisodes, getLatestEpisodes } from '@/lib/episodes';

export default async function Home() {
  const [latestEpisodes, allEpisodes] = await Promise.all([
    getLatestEpisodes(),
    getAllEpisodes(),
  ]);

  return (
    <main className="pb-28 lg:flex-1 lg:overflow-y-auto lg:pb-0">
      <LastEpisodes latestEpisodes={latestEpisodes} />

      <AllEpisodes allEpisodes={allEpisodes} />
    </main>
  );
}
