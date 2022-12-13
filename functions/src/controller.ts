import { Response } from 'express';
import { db } from './config/firebase';
import {
  checkAdmin,
  saveCompleteList,
  setOffset,
  updateVodList,
} from './supa/supaFunctions';
import { Request, Song, Vod } from './supa/types';

const authorize = async (req: Request, res: Response) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return res.status(403).json({
      status: 'Unauthorized',
      message: 'Please provide an API Key',
    });
  }

  const apiKey = req.headers.authorization.split('Bearer ')[1];

  try {
    const admin = await checkAdmin(apiKey);

    if (!admin) {
      return res.status(403).json({
        status: 'Unauthorized',
        message: 'Please provide an API Key',
      });
    }

    return;
  } catch (error: any) {
    return res.status(500).json({
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};

export const saveAllSupaVods = async (req: Request, res: Response) => {
  await authorize(req, res);

  try {
    const vods: Vod[] = await saveCompleteList();
    return res.status(200).json({
      status: 'Success',
      message: 'Supa vods saved successfully',
      data: vods,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};

export const updateSupaVods = async (req: Request, res: Response) => {
  await authorize(req, res);

  try {
    const vods: Vod[] = await updateVodList();

    if (vods.length === 0) {
      return res.status(200).json({
        status: 'Success',
        message: 'No new supa vods',
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Supa vods updated successfully',
      data: vods,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};

export const offset = async (req: Request, res: Response) => {
  await authorize(req, res);

  try {
    const {
      params: { vodId },
      body: { offset },
    } = req;

    if (await setOffset(vodId, offset)) {
      return res.status(200).json({
        status: 'Success',
        message: `${offset}s offset for ${vodId} has been set`,
      });
    }

    return res.status(400).json({
      status: 'Bad Request',
      message: "Vod doesn't exist",
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};

export const getAllVods = async (req: Request, res: Response) => {
  try {
    const vods: Vod[] = [];
    await db
      .collection('vods')
      .orderBy('publishedAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc: any) => vods.push(doc.data()));
      });
    return res.status(200).json(vods);
  } catch (error: any) {
    return res.status(500).json({
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};

export const getVod = async (req: Request, res: Response) => {
  const {
    params: { vodId },
  } = req;

  try {
    const vod = await db
      .collection('vods')
      .doc(vodId)
      .get()
      .then((doc) => {
        return doc.data();
      });

    return res.status(200).json(vod);
  } catch (error: any) {
    return res.status(500).json({
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};

export const getSongs = async (req: Request, res: Response) => {
  const {
    params: { vodId },
  } = req;

  try {
    const songs: Song[] = await db
      .collection('songs')
      .doc(vodId)
      .get()
      .then((res) => {
        const songsData = res.data();

        if (songsData) return songsData.playlist as Song[];
        return [];
        // snapshot.forEach((doc: any) => songs.push(doc.data()));
      });

    return res.status(200).json(songs);
  } catch (error: any) {
    return res.status(500).json({
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};
