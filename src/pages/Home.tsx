import type { Component } from 'solid-js';
import { Match, Switch } from 'solid-js';
import StreamList from '../components/StreamList';
import { getStreams } from '../utils/hooks';
import { Stream } from '../utils/types';

const Home: Component = () => {
  const streams = getStreams()

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
