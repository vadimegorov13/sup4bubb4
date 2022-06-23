import { db } from "../firebase/firebase";
import type { Stream } from "./types";

export const getStreams = async () => {
  try {
    const streams: Stream[] = [];

    db
      .collection("streams")
      .orderBy("publishedAt", "desc")
      .get()
      .then((res) => {
        res.forEach((doc: any) => {
          // doc.data() is never undefined for query doc snapshots
          streams.push(doc.data());
        });
      });

    return streams;
  } catch (error) {
    console.log("Couldn't get streams", error);
  }
};
