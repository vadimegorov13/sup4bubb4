import { Song } from './types';

export const getSongsTiming = async (startTime: string, songs: Song[]) => {
  const sortedSongs = songs.reverse();
  const timedSongs = sortedSongs.map((song, i) => {
    if (i === 0) {
      return {
        ...song,
        startTime:
          (new Date(song.createdAt).getTime() - new Date(startTime).getTime()) /
            1000 -
          song.duration,
      };
    } else {
      return {
        ...song,
        startTime:
          (new Date(sortedSongs[i - 1].createdAt).getTime() -
            new Date(startTime).getTime()) /
          1000,
      };
    }
  });

  return timedSongs;
};
