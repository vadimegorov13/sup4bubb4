import * as express from 'express';
import * as functions from 'firebase-functions';
import {
  getAllVods,
  getSongs,
  getVod,
  offset,
  saveAllSupaVods,
  updateSupaVods,
} from './controller';
import { updateVodList } from './supa/supaFunctions';

const app = express();

app.get('/api/streams', getAllVods);
app.post('/api/saveallsupas', saveAllSupaVods);
app.post('/api/updatesupas', updateSupaVods);
app.post('/api/offset/:streamId', offset);
app.get('/api/stream/:streamId', getVod);
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
    console.log('Daily supa vod check');
    const vods = await updateVodList();

    if (vods.length === 0) {
      console.log('No new supas');
      return;
    }

    console.log('Updated supa list');
  });
