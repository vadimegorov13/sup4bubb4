import * as express from 'express';
import * as functions from 'firebase-functions';
import {
  getAllVods,
  getSongs,
  getVod,
  saveAllSupaVods,
  updateSupaVods,
  updateStartTime,
  moveSong,
} from './controller';
// import { updateVodList } from './supa/supaFunctions';

const app = express();

app.get('/api/vods', getAllVods);
app.get('/api/vods/:vodId', getVod);
app.get('/api/songs/:vodId', getSongs);
app.post('/api/saveallsupas', saveAllSupaVods);
app.post('/api/updatesupas', updateSupaVods);
app.post('/api/updatestarttime/', updateStartTime);
app.post('/api/movesong/', moveSong);

exports.app = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '512MB',
  })
  .https.onRequest(app);

// Check every 12 hours for the new supachat vods
// exports.scheduledDailyUpdate = functions.pubsub
//   .schedule('every 12 hours')
//   .onRun(async () => {
//     console.log('Daily supa vod check');

//     const vods = await updateVodList();
//     if (vods.length === 0) {
//       console.log('No new supas');
//       return;
//     }

//     console.log('Updated supa list');
//   });
