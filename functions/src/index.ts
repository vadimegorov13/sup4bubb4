import * as express from 'express';
import * as functions from 'firebase-functions';
import {
  getAllStreams,
  getSongs,
  getStream,
  offset,
  saveAllSupaStreams,
  updateSupaStreams,
} from './controller';
import { updateStreamList } from './supa/supaFunctions';

const app = express();

app.get('/api/streams', getAllStreams);
app.post('/api/saveallsupas', saveAllSupaStreams);
app.post('/api/updatesupas', updateSupaStreams);
app.post('/api/offset/:streamId', offset);
app.get('/api/stream/:streamId', getStream);
app.get('/api/songs/:streamId', getSongs);

exports.app = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '512MB' || '2GB',
  })
  .https.onRequest(app);

exports.scheduledDailyUpdate = functions.pubsub
  .schedule('every 12 hours')
  .onRun(async () => {
    console.log('Daily supa stream check');
    const streams = await updateStreamList();

    if (streams.length === 0) {
      console.log('No new supa streams');
      return;
    }

    console.log('Updated supa stream list');
  });
