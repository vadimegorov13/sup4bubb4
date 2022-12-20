// import fetch from "node-fetch";
import { createHash } from 'crypto';
import * as rp from 'request-promise';
import { db } from '../config/firebase';
import { API_KEY, playlistAPI, SE_API, VIDEOS_API } from './api_urls';
import { getSongsTiming } from './helperFunctions';
import { Song, Vod } from './types';

/**
 * Recursive function that returns full list of vods
 *  Fetches data from the youtube api
 *
 * @param nextPageToken String that represents the next page of the playlist
 * @param vods This array gets passed to the next recursion to push new videos
 * @param maxResult Maximum number of videos fetched in one recursion
 * @param runOnce If true do not recurse
 * @returns List of vods
 */
const getPlaylist = async (
  nextPageToken: string = '',
  vods: Vod[] = [],
  maxResult: number = 50,
  runOnce: boolean = false
): Promise<Vod[]> => {
  try {
    // Get list of videos
    const response: any = await rp.get(playlistAPI(nextPageToken, maxResult));
    const vodList = JSON.parse(response);

    // Get full data of each video
    vods = await getVodsData(vodList.items, vods);

    // Return if no more pages in the playlist or runOnce == true
    if (vodList.items.length < maxResult || runOnce) {
      return vods;
    }

    // Recursion
    return await getPlaylist(vodList.nextPageToken, vods, maxResult);
  } catch (err) {
    console.log('Failed to fetch playlist\nError:', err);
    return vods;
  }
};

/**
 * This function return list of vods that meet certain conditions
 *
 * @param items An array of videos from the playlist
 * @param vods An array of videos with full data
 * @returns Supachat vods
 */
const getVodsData = async (items: any, vods: Vod[]): Promise<Vod[]> => {
  // Extruct videoId from each item
  const videoIds = items.map((item: any) => item.contentDetails.videoId);

  try {
    // Get full data of each video
    const response = await rp.get(
      `${VIDEOS_API}&id=${videoIds}&key=${API_KEY}`
    );
    const vodList = JSON.parse(response).items;

    // Get videos that include {keywords}
    const filteredVodList = vodList.filter((vod: any) => {
      const title = vod.snippet.title.toLowerCase();
      const keywords = ['supa', 'bubb4bot', 'superchat', 'yoi', 'mcthankies'];
      const blacklist = ['supa bunny'];
      return (
        keywords.some((keyword) => title.includes(keyword)) &&
        !blacklist.some((keyword) => title.includes(keyword)) &&
        vod.status.uploadStatus !== 'uploaded'
      );
    });

    // Push filtered videos to vods
    vods.push(
      ...filteredVodList.map((vod: any) => ({
        id: vod.id,
        title: vod.snippet.title,
        publishedAt: vod.snippet.publishedAt,
        duration: vod.contentDetails.duration,
        liveStreamingDetails: vod.liveStreamingDetails,
      }))
    );

    return vods;
  } catch (err) {
    console.error('Failed to fetch vods data', err);
    return vods;
  }
};

//

/**
 * Recursive function that returns history of song requests on bubb4bot
 *
 * @param limit Number of songs
 * @param offset Skip songs
 * @param songs This array gets passed to the next recursion to push new songs
 * @param runOnce If true do not recurse
 * @returns List of song requests
 */
const getHistory = async (
  limit: number = 100,
  offset: number = 0,
  songs: Song[] = [],
  runOnce: boolean = false
): Promise<Song[]> => {
  try {
    // Fetch list of requested songs
    const response = await rp.get(`${SE_API}?limit=${limit}&offset=${offset}`);
    const songHistory = JSON.parse(response).history;
    songs.push(
      ...songHistory.map((song: any) => ({
        id: song.song.videoId,
        duration: song.song.duration,
        title: song.song.title,
        channel: song.song.channel,
        createdAt: song.createdAt,
        user: song.song.user,
      }))
    );

    // Return if no more songs in the history or runOnce == true
    if (songHistory.length < limit || runOnce) {
      return songs;
    }

    // Recursion
    return await getHistory(limit, offset + limit, songs);
  } catch (err) {
    console.error('Failed to fetch song request history', err);
    return songs;
  }
};

/**
 * Functions that saves supachat vod and songs to the db
 *
 * @param vod Supachat vod
 * @param songs List of songs in the song request history
 * @returns Nothing
 */
const saveSupaVod = async (vod: Vod, songs: Song[]) => {
  // Get dates of the start and the end of the stream
  const startDate = vod.liveStreamingDetails.actualStartTime.slice(0, 10);
  const endDate = vod.liveStreamingDetails.actualEndTime.slice(0, 10) || '';

  // Get songs that were requested during the stream
  console.log('filtering songs');
  const playlist: Song[] = songs.filter((song) => {
    const createdAt = song.createdAt.slice(0, 10);
    return createdAt === startDate || createdAt === endDate;
  });

  /**
   * If there is no songs that means bubb4bot was off during the stream
   * Therefore, there is no need to save this stream to the db, so just return
   */
  if (playlist.length === 0) {
    return;
  }

  /**
   * Give timestamp to each song relative to the start of the stream
   *
   * !!!! THIS FUNCTION IS NOT PERFECT !!!!
   * It is impossible to calculate the exact time when the song was playing during
   * the stream, because of the delay on StreamElement's or YouTube's side
   */
  console.log('setting timing');
  const timedPlaylist = (await getSongsTiming(
    vod.liveStreamingDetails.actualStartTime,
    playlist
  )) as Song[];

  // Save vod to the database
  console.log(`saving vod ${vod.title}`);
  await db.collection('vods').doc(vod.id).set(vod);

  // Save list of songs to the database
  console.log('saving songs');
  await db.collection('songs').doc(vod.id).set({ playlist: timedPlaylist });
};

// Combine songs with appropriate vod

/**
 * Save every supachat vod and songs from bubb4bot
 *
 * @returns Nothing
 */
export const saveCompleteList = async () => {
  // Get songs and vods
  const songs: Song[] = await getHistory();
  const vods: Vod[] = await getPlaylist();

  // Iterate throught every vod and assign songs to it
  const savedVods = await Promise.all(
    vods.map(async (vod) => {
      await saveSupaVod(vod, songs);
      return vod;
    })
  );

  return savedVods;
};

/**
 * Save latest supachat vod and songs from bubb4bot
 *
 * @returns Nothing
 */
export const updateVodList = async () => {
  // Get new supachat vods
  const vods: Vod[] = await getPlaylist('', [], 50, false);

  // Check if no supachat vods
  if (!vods.length) return [];

  // Get new songs
  const songs: Song[] = await getHistory(100, 0, [], true);

  // Iterate throught every vod and assign songs to it
  for (const vod of vods) {
    const doc = await db.collection('vods').doc(vod.id).get();
    if (doc.exists) {
      continue;
    }

    await saveSupaVod(vod, songs);
  }

  return vods;
};

/**
 * Validation function
 * Checks if apiKey matches
 *
 * @param apiKey
 * @returns True of False
 */
export const checkAdmin = async (apiKey: string) => {
  if (!apiKey) return false;

  const hashedAPIKey = createHash('md5').update(apiKey).digest('hex');
  const doc = await db.collection('apiKey').doc('admin').get();
  const data = doc.data();
  if (!data) {
    return false;
  }

  return hashedAPIKey === data.hashedAPIKey;
};

// TODO: FINISH this shit

// This function will change the startTime of one song
// which will change startTime of every other song relative to this one song
export const changeStartTime = async (
  vodId: string,
  songId: string,
  newStartTime: number,
  changeAll: boolean = false
) => {
  // get songs by vodId
  const doc = await db.collection('songs').doc(vodId).get();
  const songs: Song[] | undefined = doc.data()?.playlist || undefined;

  if (!songs) {
    return {
      status: 400,
      message: `Vod with id:${vodId} doesn't exist`,
    };
  }

  const song: Song | undefined = songs.find((song) => song.id === songId);
  if (!song) {
    return {
      status: 400,
      message: `Song with id:${songId} doesn't exist in this list`,
    };
  }

  let updatedSongs: Song[];

  if (!changeAll) {
    // Assign new
    updatedSongs = songs.map((s) => {
      if (s.id === songId) {
        return { ...s, startTime: newStartTime };
      }
      return s;
    });
  } else {
    // get |newStartTime - oldStartTime|
    const timeOffset = newStartTime - song.startTime!;

    // Assign new startTime to each song relative to the first one
    updatedSongs = songs.map((s) => {
      return { ...s, startTime: s.startTime! + timeOffset };
    });
  }

  // set new list of songs
  await db.collection('songs').doc(vodId).set({ playlist: updatedSongs });

  return {
    status: 200,
    message: `The timestamp of the song has been changed`,
  };
};

// move song to other supachat
export const moveSong = async (
  fromVodId: string,
  toVodId: string,
  songId: string
) => {
  // get songs by fromVodId
  // get song whose id matches the songId
  // remove the song from the list of the fromVodId
  // get songs by toVodId
  // get startTime and duration of the last song
  // add moving song to the list with the new startTime
};
