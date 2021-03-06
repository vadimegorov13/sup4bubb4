import * as express from "express";
import * as functions from "firebase-functions";
import { updateStreamList } from "./supa/supaFunctions";
import {
  getAllStreams,
  getSongs,
  getStream,
  saveAllSupaStreams,
  updateSupaStreams,
} from "./supaController";

const app = express();
app.get("/test", (req, res) => {
  res.status(200).send("test");
});

app.get("/api/streams", getAllStreams);
app.post("/api/saveallsupas", saveAllSupaStreams);
app.post("/api/updatesupas", updateSupaStreams);
app.get("/api/stream/:streamId", getStream);
app.get("/api/songs/:streamId", getSongs);

exports.app = functions
  .runWith({
    timeoutSeconds: 120,
    memory: "512MB" || "2GB",
  })
  .https.onRequest(app);

exports.scheduledDailyUpdate = functions.pubsub
  .schedule("every 12 hours")
  .onRun(async () => {
    console.log("Daily supa stream check");
    const streams = await updateStreamList();

    if (streams.length === 0) {
      console.log("No new supa streams");
      return;
    }

    console.log("Updated supa stream list");
  });
