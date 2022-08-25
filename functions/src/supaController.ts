import { Response } from "express";
import { db } from "./config/firebase";
import { checkAdmin, saveCompleteList, setOffset, updateStreamList } from "./supa/supaFunctions";
import { Request, Song, Stream } from "./supa/types";

const authorize = async (req: Request, res: Response) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(403).json({
      status: "Unauthorized",
      message: "Please provide an API Key",
    });
  }

  const apiKey = req.headers.authorization.split('Bearer ')[1];

  try {
    const admin = await checkAdmin(apiKey);

    if (!admin) {
      return res.status(403).json({
        status: "Unauthorized",
        message: "Please provide an API Key",
      });
    }

    return;
  } catch(error: any) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.message,
    });
  }
}

export const saveAllSupaStreams = async (req: Request, res: Response) => {
  await authorize(req, res);

  try {
    const streams: Stream[] = await saveCompleteList();
    return res.status(200).json({
      status: "Success",
      message: "Supa streams saved successfully",
      data: streams,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

export const updateSupaStreams = async (req: Request, res: Response) => {
  await authorize(req, res);

  try {
    const streams: Stream[] = await updateStreamList();

    if (streams.length === 0){
      return res.status(200).json({
        status: "Success",
        message: "No new supa streams",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Supa streams updated successfully",
      data: streams,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

export const offset = async (req: Request, res: Response) => {
  await authorize(req, res);

  try {
    const {
      params: { streamId },
      body: { offset },
    } = req;

    if (await setOffset(streamId, offset)){
      return res.status(200).json({
        status: "Success",
        message: `${offset}s offset for ${streamId} has been set`,
      });
    }

    return res.status(400).json({
      status: "Bad Request",
      message: "Stream doesn't exist"
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

export const getAllStreams = async (req: Request, res: Response) => {
  try {
    const streams: Stream[] = [];
    await db
      .collection("streams")
      .orderBy('publishedAt', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc: any) => streams.push(doc.data()));
      });
    return res.status(200).json(streams);
  } catch (error: any) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

export const getStream = async (req: Request, res: Response) => {
  const {
    params: { streamId },
  } = req;

  try {
    const stream = await db
      .collection("streams")
      .doc(streamId)
      .get()
      .then((doc) => {
        return doc.data();
      });

    return res.status(200).json(stream);
  } catch (error: any) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

export const getSongs = async (req: Request, res: Response) => {
  const {
    params: { streamId },
  } = req;

  try {
    const songs: Song[] = await db
      .collection("songs")
      .doc(streamId)
      .get()
      .then((res) => {
        const songsData = res.data()

        if (songsData) return songsData.playlist as Song[]
        return []
        // snapshot.forEach((doc: any) => songs.push(doc.data()));
      });

    return res.status(200).json(songs);
  } catch (error: any) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

