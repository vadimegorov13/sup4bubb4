import { StreamRepo } from '$lib/repos/stream';
import type { RequestHandler } from '@sveltejs/kit';

const streamsRepo = new StreamRepo();

export const GET: RequestHandler = async () => {
  const streams = await streamsRepo.getAll();

  if (!streams) {
    return { status: 404 };
  }

  return {
    status: 200,
    body: {
      streams,
    },
  };
};
