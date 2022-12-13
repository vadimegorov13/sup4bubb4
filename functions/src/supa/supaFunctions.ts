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
) => {
  const result: Vod[] = await rp
    .get(playlistAPI(nextPageToken, maxResult))
    .then((response) => JSON.parse(response))
    .then(async (list: any) => {
      vods = await getVodData(list.items, vods);

      if (list.items.length < maxResult || runOnce) {
        return vods;
      }

      return await getPlaylist(list.nextPageToken, vods, maxResult);
    })
    .catch((err) => {
      console.log('Failed to fetch playlist\nError:', err);
      return vods;
    });

  return result;
};

/**
 * This function return list of vods that meet certain conditions.
 *
 * The items argument is an array videos from the playlist,
 * and vods is an array of Vod objects.
 */
const getVodData = async (items: any, vods: Vod[]) => {
  const videoIds = items.map((item: any) => item.contentDetails.videoId);

  const list: any = await rp
    .get(`${VIDEOS_API}&id=${videoIds}&key=${API_KEY}`)
    .then((response) => JSON.parse(response))
    .catch((err) => {
      console.log('Failed to fetch video data\nError:', err);
      return vods;
    });

  list.items
    // Filter vods by title
    .filter((item: any) => {
      const title = item.snippet.title.toLowerCase();
      return (
        (title.includes('supa') ||
          title.includes('bubb4bot') ||
          title.includes('superchat') ||
          title.includes('yoi') ||
          title.includes('mcthankies')) &&
        !title.includes('SUPA BUNNY') &&
        item.status.uploadStatus !== 'uploaded'
      );
    })
    // Add to the list
    .forEach((item: any) => {
      vods.push({
        id: item.id,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails.duration,
        liveStreamingDetails: item.liveStreamingDetails,
      });
    });

  return vods;
};

// Get full history of music requests on bubb4bot
const getHistory = async (
  limit: number = 100,
  offset: number = 0,
  songs: Song[] = [],
  runOnce: boolean = false
) => {
  const result: Song[] = await rp
    .get(`${SE_API}?limit=${limit}&offset=${offset}`)
    .then((response) => JSON.parse(response))
    .then((result: any) => result.history)
    .then(async (items) => {
      items.forEach((item: any) => {
        songs.push({
          id: item.song.videoId,
          duration: item.song.duration,
          title: item.song.title,
          channel: item.song.channel,
          createdAt: item.createdAt,
          user: item.song.user,
        });
      });

      if (items.length < 100 || runOnce) {
        return songs;
      }

      return await getHistory(limit, offset + limit, songs);
    })
    .catch((err) => {
      console.log('Failed to fetch history\nError:', err);
      return songs;
    });

  return result;
};

const saveVod = async (vod: Vod, songs: Song[]) => {
  const startDate = vod.liveStreamingDetails.actualStartTime.slice(0, 10);
  const endDate = vod.liveStreamingDetails.actualEndTime.slice(0, 10) || '';

  console.log('filtering songs');
  const playlist: Song[] = songs.filter((song) => {
    const createdAt = song.createdAt.slice(0, 10);
    if (createdAt === startDate || createdAt === endDate) {
      return true;
    }
    return false;
  });

  if (playlist.length !== 0) {
    console.log('setting timing');
    const timedPlaylist = (await getSongsTiming(
      vod.liveStreamingDetails.actualStartTime,
      playlist
    )) as Song[];

    console.log(`saving vod ${vod.title}`);
    await db
      .collection('vods')
      .doc(vod.id)
      .set(vod)
      .then(async () => {
        console.log('saving songs');
        await db
          .collection('songs')
          .doc(vod.id)
          .set({ playlist: timedPlaylist });
      });
  }
};

// Combine songs with appropriate vod
export const saveCompleteList = async () => {
  const songs: Song[] = await getHistory();
  const vods: Vod[] = await getPlaylist();

  // Iterate throught every vod and assign songs to it
  console.log('Iterating vods');
  vods.forEach(async (vod) => {
    saveVod(vod, songs);
  });

  return vods;
};

// Combine songs with appropriate vod
export const updateVodList = async () => {
  const vods: Vod[] = await getPlaylist('', [], 50, false);

  if (!vods.length) return [];

  const songs: Song[] = await getHistory(100, 0, [], true);

  // Iterate throught every vod and assign songs to it
  vods.forEach(async (vod) => {
    const exit = await db
      .collection('vods')
      .doc(vod.id)
      .get()
      .then((res) => {
        if (res.exists) {
          return true;
        }
        return false;
      });

    if (exit) return;

    saveVod(vod, songs);
  });

  return vods;
};

export const setOffset = async (vodId: string, offset: number) => {
  console.log(`setting ${offset}s offset for ${vodId}`);
  return await db
    .collection('vods')
    .doc(vodId)
    .get()
    .then(async (doc) => {
      const data = doc.data() as Vod;
      if (data) {
        await db
          .collection('vods')
          .doc(vodId)
          .set({ ...data, offset });
        return true;
      }
      return false;
    });
};

export const checkAdmin = async (apiKey: string) => {
  if (!apiKey) return false;

  const hashedAPIKey = createHash('md5').update(apiKey).digest('hex');
  const adminKey: string | '' = await db
    .collection('apiKey')
    .doc('admin')
    .get()
    .then((doc) => {
      const data = doc.data();
      if (data) return data.hashedAPIKey as string;
      return '';
    });

  if (hashedAPIKey === adminKey) return true;

  return false;
};
