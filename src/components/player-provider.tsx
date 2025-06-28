'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { Episode } from '@/types/episode';

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], startIndex?: number) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
};

const PlayerContext = createContext({} as PlayerContextData);

type PlayerProviderProps = Readonly<{
  children: ReactNode;
}>;

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const hasNext = useMemo(
    () => currentEpisodeIndex < episodeList.length - 1,
    [currentEpisodeIndex, episodeList.length]
  );

  const hasPrevious = useMemo(
    () => currentEpisodeIndex > 0,
    [currentEpisodeIndex]
  );

  const play = useCallback(
    (episode: Episode) => {
      if (!episode?.link) {
        //biome-ignore lint/suspicious/noConsole: console.error
        console.error('Episódio inválido:', episode);
        return;
      }

      const episodeIndex = episodeList.findIndex((ep) => ep.id === episode.id);

      if (episodeIndex === currentEpisodeIndex && isPlaying) {
        setIsPlaying(false);
        return;
      }

      let newEpisodeList = [...episodeList];
      let newIndex = -1;

      if (episodeIndex !== -1) {
        newEpisodeList = newEpisodeList.filter((ep) => ep.id !== episode.id);
      }

      newEpisodeList.push(episode);
      newIndex = newEpisodeList.length - 1;

      setEpisodeList(newEpisodeList);
      setCurrentEpisodeIndex(newIndex);
      setIsPlaying(true);
    },
    [currentEpisodeIndex, episodeList, isPlaying]
  );

  const playList = useCallback((list: Episode[], startIndex = 0) => {
    if (!list?.length) {
      //biome-ignore lint/suspicious/noConsole: console.error
      console.error('Lista de episódios vazia');
      return;
    }

    const validEpisodes = list.filter((episode) => episode?.link);

    if (!validEpisodes.length) {
      //biome-ignore lint/suspicious/noConsole: console.error
      console.error('Nenhum episódio válido na lista');
      return;
    }

    const validIndex = Math.max(
      0,
      Math.min(startIndex, validEpisodes.length - 1)
    );

    setEpisodeList(validEpisodes);
    setCurrentEpisodeIndex(validIndex);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((state) => !state);
  }, []);

  const setPlayingState = useCallback((state: boolean) => {
    setIsPlaying(state);
  }, []);

  const clearPlayerState = useCallback(() => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(-1);
    setIsPlaying(false);
  }, []);

  const playNext = useCallback(() => {
    if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }, [currentEpisodeIndex, hasNext]);

  const playPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }, [hasPrevious, currentEpisodeIndex]);

  const value = useMemo(
    () => ({
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      hasNext,
      hasPrevious,
      play,
      playList,
      togglePlay,
      setPlayingState,
      playNext,
      playPrevious,
      clearPlayerState,
    }),
    [
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      hasNext,
      hasPrevious,
      play,
      playList,
      togglePlay,
      setPlayingState,
      playNext,
      playPrevious,
      clearPlayerState,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
