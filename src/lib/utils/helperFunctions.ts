/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Song, Stream } from '$lib/types';
import { parse } from 'iso8601-duration';
import moment from 'moment';

const parseDuration = (duration: string) => {
  const parsedDuration = parse(duration);
  const durationStr = `${parsedDuration.hours}:${
    parsedDuration.minutes! / 10 < 1
      ? `0${parsedDuration.minutes}`
      : parsedDuration.minutes
  }:${
    parsedDuration.seconds! / 10 < 1
      ? `0${parsedDuration.seconds}`
      : parsedDuration.seconds
  }`;

  const durationNum =
    parsedDuration.hours! * 3600 +
    parsedDuration.minutes! * 60 +
    parsedDuration.seconds!;

  return { durationStr, durationNum };
};

export const convertHMS = (sec: number) => {
  let hours: number | string = Math.floor(sec / 3600); // get hours
  let minutes: number | string = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds: number | string = Math.floor(sec - hours * 3600 - minutes * 60); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
};

export const getTime = (stream: Stream) => {
  const date = moment.parseZone(stream.publishedAt).fromNow();
  const { durationStr, durationNum } = parseDuration(stream.duration);

  return { date, durationStr, durationNum };
};

// TODO: add "offset" variable
export const getSongsTiming = async (
  startTime: string,
  songs: Song[],
  offset: number
) => {
  const sortedSongs = songs.reverse();
  const timedSongs = sortedSongs.map((song, i) => {
    if (i === 0) {
      return {
        ...song,
        startTime:
          (new Date(song.createdAt).getTime() - new Date(startTime).getTime()) /
            1000 +
          offset -
          song.duration,
      };
    } else {
      return {
        ...song,
        startTime:
          (new Date(sortedSongs[i - 1].createdAt).getTime() -
            new Date(startTime).getTime()) /
            1000 +
          offset,
      };
    }
  });

  return timedSongs;
};

export const playSong = (
  streamTime: number,
  lastTimeUpdate: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  songPlayer: any,
  songs: Song[],
  currentSong: Song,
  songVolume: number,
  offset: number
) => {
  if (streamTime < songs[0].startTime! + offset) {
    songPlayer.pause();
    return currentSong;
  }

  // Get a song depending on the stream time
  songs.some((song, i) => {
    if (
      currentSong !== song &&
      Math.floor(streamTime) >= Math.floor(song.startTime! + offset) &&
      Math.floor(streamTime) < Math.floor(songs[i + 1].startTime! + offset)
    ) {
      currentSong = song;
      songPlayer.loadVideoById(
        currentSong.id,
        streamTime - currentSong.startTime! + offset
      );
      songPlayer.setVolume(songVolume);
      return;
    }

    // change time of the song when time of the stream changes
    if (
      currentSong === song &&
      (lastTimeUpdate > Math.floor(streamTime) + 1 ||
        lastTimeUpdate < Math.floor(streamTime) - 1)
    ) {
      // console.log(`Last Update: ${lastTimeUpdate}\nStream Time: ${streamTime}`);
      songPlayer.setTime(lastTimeUpdate - currentSong.startTime! + offset);
      return;
    }
  });

  return currentSong;
};
