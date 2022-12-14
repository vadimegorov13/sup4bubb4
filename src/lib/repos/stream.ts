import type { Song, Stream } from '$lib/types';

export class StreamRepo {
  getAll = async (): Promise<Stream[]> => {
    const streamsRes = await fetch(`https://sup4bubb4.web.app/api/vods`);
    const streams = (await streamsRes.json()) as Stream[];

    return streams ?? [];
  };

  getStreamData = async (
    id: string
  ): Promise<{ stream: Stream; songs: Song[] }> => {
    const streamRes = await fetch(`https://sup4bubb4.web.app/api/vods/${id}`);
    const stream = (await streamRes.json()) as Stream;

    const songsRes = await fetch(`https://sup4bubb4.web.app/api/songs/${id}`);
    const songs = (await songsRes.json()) as Song[];

    return { stream, songs } ?? {};
  };
}
