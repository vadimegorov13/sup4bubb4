import { StreamRepo } from '$lib/repos/stream';
import type { RequestHandler } from './__types/[id]';

const streamsRepo = new StreamRepo();

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;

  const { stream, songs } = await streamsRepo.getStreamData(id);

  if (!stream || !songs) {
    return { status: 404 };
  }

  console.log(stream);

  return {
    status: 200,
    body: {
      stream,
      songs,
    },
  };
};
