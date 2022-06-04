import { Response } from "express";
import { db } from "./config/firebase";
import { checkAdmin, saveCompleteList, updateStreamList } from "./supa/supaFunctions";
import { Request, Song, Stream } from "./supa/types";

const saveAllSupaStreams = async (req: Request, res: Response) => {
  try {
    const {
      body: { apiKey },
    } = req;

    if (!apiKey) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Please provide an API Key",
      });
    }

    const admin = await checkAdmin(apiKey);

    if (!admin) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Who is you??",
      });
    }

    const streams: Stream[] = await saveCompleteList();
    return res.status(200).json({
      status: "Success",
      message: "Supa streams saved successfully",
      data: streams,
    });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

const updateSupaStreams = async (req: Request, res: Response) => {
  try {
    const {
      body: { apiKey },
    } = req;

    if (!apiKey) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Please provide an API Key",
      });
    }

    const admin = await checkAdmin(apiKey);

    if (!admin) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Who is you??",
      });
    }

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
    return res.status(500).json(error.message);
  }
};

const getAllStreams = async (req: Request, res: Response) => {
  try {
    const streams: Stream[] = [];
    await db
      .collection("streams")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc: any) => streams.push(doc.data()));
      });
    return res.status(200).json(streams);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

const getStream = async (req: Request, res: Response) => {
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
    return res.status(500).json(error.message);
  }
};

const getSongs = async (req: Request, res: Response) => {
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
    return res.status(500).json(error.message);
  }
};

export { saveAllSupaStreams, updateSupaStreams, getAllStreams, getStream, getSongs };
