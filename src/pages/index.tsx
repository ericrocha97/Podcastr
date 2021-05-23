import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import { usePlayer } from '../contexts/PlayerContext';

import styles from './home.module.scss';
import axios from 'axios';
import { substringGUID } from '../utils/substringGUID';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  const { playList, currentEpisodeIndex, isPlaying, togglePlay } = usePlayer();
  //const { updateFavotireList, checkFavoriteItem } = useFavorite();

  //const { changeLoaderTrue } = useLoader();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  const playButton = (episodeList, index) => {
    if (currentEpisodeIndex === index && isPlaying) {
      togglePlay();
    } else {
      playList(episodeList, index);
    }
  };

  return (
    <div className={styles.homePage}>


      <Head>
        <title>Home | Podcastr</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image width={100} height={100} src={episode.thumbnail} alt={episode.title} objectFit="cover" className={styles.thumbImg} />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>

                </div>

                <button type="button" onClick={() => playButton(episodeList, index)}>
                  <img src={currentEpisodeIndex === index && isPlaying ? "/pause-green.svg" : "/play-green.svg"} alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th colSpan={3}>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td>
                  </td>
                  <td>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td><span>{episode.members}</span></td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playButton(episodeList, index + latestEpisodes.length)}>
                      <img src={currentEpisodeIndex === index + latestEpisodes.length && isPlaying ? "/pause-green.svg" : "/play-green.svg"} alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
export const getStaticProps: GetStaticProps = async () => {
  /*const { data } = await api.get('episodes', {
    params: {
      _limit: 50,
      _sort: 'published_at',
      _order: 'desc'
    }
  });*/
  /*const apiteste = axios.create({
    baseURL: "https://feeds.soundcloud.com/users/soundcloud:users:533708286/sounds.rss"
  });*/
  const { data } = await axios.get(process.env.API_RSS)

  //console.log(teste.data)

  /*const xml = new XMLParser().parseFromString(teste.data);

  console.log(xml)*/


  const episodes = data.items.map(episode => {
    return {
      id: substringGUID(episode.guid),
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: "André, Tatá, Pera, Gio, Léo, Pitty",
      publishedAt: format(parseISO(episode.pubDate), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.enclosure.duration),
      durationAsString: convertDurationToTimeString(Number(episode.enclosure.duration)),
      url: episode.enclosure.link
    }
  })

  //console.log(episodesTeste)


  /*const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })*/

  /*const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)*/

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}