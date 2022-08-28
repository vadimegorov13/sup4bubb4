import type { Song, Stream } from '$lib/types';
import { getSongsTiming } from '$lib/utils/helperFunctions';

export class StreamRepo {
  getAll = async (): Promise<Stream[]> => {
    const resStreams = await fetch(`https://sup4bubb4.web.app/api/streams`);
    const streams = (await resStreams.json()) as Stream[];

    return streams ?? [];
  };

  getStreamData = async (
    id: string
  ): Promise<{ stream: Stream; songs: Song[] }> => {
    const resStream = await fetch(`https://sup4bubb4.web.app/api/stream/${id}`);
    const stream = (await resStream.json()) as Stream;

    const resSongs = await fetch(`https://sup4bubb4.web.app/api/songs/${id}`);
    const songs = await resSongs.json();

    const timedSongs = await getSongsTiming(
      stream.liveStreamingDetails.actualStartTime,
      songs,
      stream.offset ? stream.offset : 0
    );

    return { stream, songs: timedSongs } ?? {};
  };
}
