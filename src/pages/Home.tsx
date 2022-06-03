import { collection, getFirestore } from 'firebase/firestore';
import { useFirestore } from 'solid-firebase';
import type { Component } from 'solid-js';
import { Match, Switch } from 'solid-js';
import StreamList from '../components/StreamList';

type StreamDetails = {
  actualEndTime: string;
  actualStartTime: string;
  scheduledStartTime: string;
};

type Stream = {
  id: string;
  liveStreamingDetails: StreamDetails;
  publishedAt: string;
  title: string;
};

const Home: Component = () => {
  const db = getFirestore();
  const streams = useFirestore(collection(db, 'streams'));

  return (
    <div>
      <p class="text-4xl text-yellow-400 text-center py-20">Home page</p>
      <Switch>
        <Match when={streams.loading}>
          <p>Loading...</p>
        </Match>
        <Match when={streams.error}>
          <p>An error occurred.</p>
        </Match>
        <Match when={streams.data}>
          <StreamList streams={streams.data as Stream[]} />
        </Match>
      </Switch>
    </div>
  );
};

export default Home;
