// import fetch from "node-fetch";
import { createHash } from "crypto";
import * as rp from "request-promise";
import { db } from "../config/firebase";
import { API_KEY, playlistAPI, SE_API, VIDEOS_API } from "./api_urls";
import { Song, Stream } from "./types";

// Get uploads playlist
const getPlaylist = async (
  nextPageToken: string = "",
  streams: Stream[] = [],
  maxResult: number = 50,
  runOnce: boolean = false
) => {
  const result: Stream[] = await rp
    .get(playlistAPI(nextPageToken, maxResult))
    .then((response) => JSON.parse(response))
    .then(async (list: any) => {
      streams = await getStreamData(list.items, streams);

      if (list.items.length < maxResult || runOnce) {
        return streams;
      }

      return await getPlaylist(list.nextPageToken, streams, maxResult);
    })
    .catch((err) => {
      console.log("Failed to fetch playlist\nError:", err);
      return streams;
    });

  return result;
};

// Get all streams from the playlist
const getStreamData = async (items: any, streams: Stream[]) => {
  const videoIds = items.map((item: any) => {
    return item.contentDetails.videoId;
  });

  const result: Stream[] = await rp
    .get(`${VIDEOS_API}&id=${videoIds}&key=${API_KEY}`)
    .then((response) => JSON.parse(response))
    .then((list: any) => list.items)
    .then((items) => {
      items.forEach((item: any) => {
        // Check if supa or yoi stream
        if (
          (item.snippet.title.toLowerCase().includes("supa") ||
          item.snippet.title.toLowerCase().includes("bubb4bot") ||
          item.snippet.title.toLowerCase().includes("superchat") ||
          item.snippet.title.toLowerCase().includes("yoi")) &&
          !item.snippet.title.toLowerCase().includes("SUPA BUNNY") &&
          item.status.uploadStatus !== "uploaded"
        ) {
          // Add to the list
          streams.push({
            id: item.id,
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
            duration: item.contentDetails.duration,
            liveStreamingDetails: item.liveStreamingDetails,
          });
        }
      });

      return streams;
    })
    .catch((err) => {
      console.log("Failed to fetch video data\nError:", err);
      return streams;
    });

  return result;
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
      console.log("Failed to fetch history\nError:", err);
      return songs;
    });

  return result;
};

const saveStream = async (stream: Stream, songs: Song[]) => {
  const startTime = stream.liveStreamingDetails.actualStartTime.slice(0, 10);
  const endTime = stream.liveStreamingDetails.actualEndTime.slice(0, 10) || "";
  const playlist: Song[] = [];

  songs.forEach((song) => {
    const createdAt = song.createdAt.slice(0, 10);
    if (createdAt === startTime || createdAt === endTime) {
      playlist.push(song)
    }
  });

  if (playlist.length !== 0){
    console.log(`saving stream ${stream.title}`)
    await db
      .collection("streams")
      .doc(stream.id)
      .set(stream)
      .then(async () => {
        console.log("saving songs")
        await db
          .collection("songs")
          .doc(stream.id)
          .set({ playlist: playlist })
      });
  }
  
};

// Combine songs with appropriate stream
export const saveCompleteList = async () => {
  const songs: Song[] = await getHistory();
  const streams: Stream[] = await getPlaylist();

  // Iterate throught every stream and assign songs to it
  console.log("Iterating streams")
  streams.forEach(async (stream) => {
    saveStream(stream, songs);
  });

  return streams;
};

// Combine songs with appropriate stream
export const updateStreamList = async () => {
  const streams: Stream[] = await getPlaylist("", [], 5, true);

  if (streams.length === 0) {
    return [];
  }

  const songs: Song[] = await getHistory(100, 0, [], true);

  // Iterate throught every stream and assign songs to it
  streams.forEach(async (stream) => {
    const exit = await db
      .collection("streams")
      .doc(stream.id)
      .get()
      .then((res) => {
        if (res.exists) {
          return true;
        }
        return false;
      });

    if (exit) {
      return;
    }

    saveStream(stream, songs);
  });

  return streams;
};

export const checkAdmin = async (apiKey: string) => {
  if (!apiKey) return false

  const hashedAPIKey = createHash("md5").update(apiKey).digest("hex");
  const adminKey: string | "" = await db
    .collection("apiKey")
    .doc("admin")
    .get()
    .then((doc) => {
      const data = doc.data();
      if (data) return data.hashedAPIKey as string;
      return "";
    });

  if (hashedAPIKey === adminKey) return true;
  
  return false;
};
