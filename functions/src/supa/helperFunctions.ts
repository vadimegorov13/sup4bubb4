import { Song } from './types';

/**
 * This function sorts and timestamps songs reletive to the
 * start of the stream
 *
 * @param startTime Date on which the stream has started
 * @param songs List of songs played during the stream
 * @returns Sorted and timestamped list of songs
 */
export const getSongsTiming = async (startTime: string, songs: Song[]) => {
  const startTimestamp = new Date(startTime).getTime();
  const timedSongs = songs.reverse().map((song, i) => {
    const songTimestamp = new Date(song.createdAt).getTime();
    return {
      ...song,
      startTime:
        (songTimestamp - startTimestamp) / 1000 - (i === 0 ? song.duration : 0),
    };
  });

  return timedSongs;
};

// export const getSongsTiming = async (startTime: string, songs: Song[]) => {
//   const sortedSongs = songs.reverse();
//   const timedSongs = sortedSongs.map((song, i) => {
//     if (i === 0) {
//       return {
//         ...song,
//         startTime:
//           (new Date(song.createdAt).getTime() - new Date(startTime).getTime()) /
//             1000 -
//           song.duration,
//       };
//     } else {
//       return {
//         ...song,
//         startTime:
//           (new Date(sortedSongs[i - 1].createdAt).getTime() -
//             new Date(startTime).getTime()) /
//           1000,
//       };
//     }
//   });

//   return timedSongs;
// };
