// import fetch from "node-fetch";
import { createHash } from 'crypto';
import * as rp from 'request-promise';
import { db } from '../config/firebase';
import { API_KEY, playlistAPI, SE_API, VIDEOS_API } from './api_urls';
import { getSongsTiming } from './helperFunctions';
import { Song, Vod } from './types';

// Get uploads playlist
const getPlaylist = async (
  nextPageToken: string = '',
  vods: Vod[] = [],
  maxResult: number = 50,
  runOnce: boolean = false
): Promise<Vod[]> => {
  try {
    const response: any = await rp.get(playlistAPI(nextPageToken, maxResult));
    const vodList = JSON.parse(response);
    vods = await getVodsData(vodList.items, vods);

    if (vodList.items.length < maxResult || runOnce) {
      return vods;
    }

    return await getPlaylist(vodList.nextPageToken, vods, maxResult);
  } catch (err) {
    console.log('Failed to fetch playlist\nError:', err);
    return vods;
  }
};

/**
 * This function return list of vods that meet certain conditions.
 *
 * The items argument is an array videos from the playlist,
 * and vods is an array of Vod objects.
 */
const getVodsData = async (items: any, vods: Vod[]) => {
  const videoIds = items.map((item: any) => item.contentDetails.videoId);

  try {
    const response = await rp.get(
      `${VIDEOS_API}&id=${videoIds}&key=${API_KEY}`
    );
    const vodList = JSON.parse(response).items;
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

    vods.push(
      ...filteredVodList.map((vod: any) => ({
        id: vod.id,
        title: vod.snippet.title,
        publishedAt: vod.snippet.publishedAt,
        duration: vod.contentDetails.duration,
        liveStreamingDetails: vod.liveStreamingDetails,
      }))
    );
  } catch (err) {
    console.error('Failed to fetch vods data', err);
    return vods;
  }

  return vods;
};

// Get full history of music requests on bubb4bot
const getHistory = async (
  limit: number = 100,
  offset: number = 0,
  songs: Song[] = [],
  runOnce: boolean = false
): Promise<Song[]> => {
  try {
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

    if (songHistory.length < limit || runOnce) {
      return songs;
    }

    return await getHistory(limit, offset + limit, songs);
  } catch (err) {
    console.error('Failed to fetch song request history', err);
    return songs;
  }
};

const saveSupaVod = async (vod: Vod, songs: Song[]) => {
  const startDate = vod.liveStreamingDetails.actualStartTime.slice(0, 10);
  const endDate = vod.liveStreamingDetails.actualEndTime.slice(0, 10) || '';

  console.log('filtering songs');
  const playlist: Song[] = songs.filter((song) => {
    const createdAt = song.createdAt.slice(0, 10);
    return createdAt === startDate || createdAt === endDate;
  });

  if (playlist.length === 0) {
    return;
  }

  console.log('setting timing');
  const timedPlaylist = (await getSongsTiming(
    vod.liveStreamingDetails.actualStartTime,
    playlist
  )) as Song[];

  console.log(`saving vod ${vod.title}`);
  await db.collection('vods').doc(vod.id).set(vod);

  console.log('saving songs');
  await db.collection('songs').doc(vod.id).set({ playlist: timedPlaylist });
};

// Combine songs with appropriate vod
export const saveCompleteList = async () => {
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

// Combine songs with appropriate vod
export const updateVodList = async () => {
  const vods: Vod[] = await getPlaylist('', [], 50, false);

  if (!vods.length) return [];

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

export const setOffset = async (vodId: string, offset: number) => {
  console.log(`setting ${offset}s offset for ${vodId}`);

  const doc = await db.collection('vods').doc(vodId).get();
  const data = doc.data() as Vod;
  if (!data) {
    return false;
  }

  await db
    .collection('vods')
    .doc(vodId)
    .set({ ...data, offset });
  return true;
};

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
