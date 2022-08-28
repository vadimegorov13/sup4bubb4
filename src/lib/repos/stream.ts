import type { Song, Stream } from '$lib/types';
import { getSongsTiming } from '$lib/utils/helperFunctions';

export class StreamRepo {
  getAll = async (): Promise<Stream[]> => {
    const streamsRes = await fetch(`https://sup4bubb4.web.app/api/streams`);
    const streams = (await streamsRes.json()) as Stream[];

    return streams ?? [];
  };

  getStreamData = async (
    id: string
  ): Promise<{ stream: Stream; songs: Song[] }> => {
    const streamRes = await fetch(`https://sup4bubb4.web.app/api/stream/${id}`);
    const stream = (await streamRes.json()) as Stream;

    const songsRes = await fetch(`https://sup4bubb4.web.app/api/songs/${id}`);
    const songs = (await songsRes.json()) as Song[];

    // if (stream.offset) {
    //   songs = songs.map((song) => {
    //     return { ...song, startTime: song.startTime + stream.offset! };
    //   });
    // }

    // const timedSongs = (await getSongsTiming(
    //   stream.liveStreamingDetails.actualStartTime,
    //   songs,
    //   stream.offset ? stream.offset : 0
    // )) as Song[];

    return { stream, songs: songs } ?? {};
  };
}
