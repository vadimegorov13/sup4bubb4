import { Song } from './types';

/**
 * This function sorts and timestamps songs relative to the
 * start of the stream
 *
 * !!!! THIS FUNCTION IS NOT PERFECT !!!!
 * It is impossible to calculate the exact time when the song was playing during
 * the stream, because of the delay on StreamElement's or YouTube's side
 *
 * @param startTime Date on which the stream has started
 * @param songs List of songs played during the stream
 * @returns Sorted and timestamped list of songs
 */
// export const getSongsTiming = async (startTime: string, songs: Song[]) => {
//   const startTimestamp = new Date(startTime).getTime();
//   const timedSongs: Song[] = songs.reverse().map((song, i) => {
//     const songTimestamp = new Date(song.createdAt).getTime();
//     return {
//       ...song,
//       startTime: (songTimestamp - startTimestamp) / 1000 - song.duration,
//     };
//   });

//   return timedSongs;
// };

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
