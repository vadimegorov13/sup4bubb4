import { Component, lazy, Match, Switch } from 'solid-js';
import { getStreams } from '../utils/hooks';
import { Stream } from '../utils/types';

const StreamList = lazy(() => import('../components/StreamList'));

const Home: Component = () => {
  const streams = getStreams();

  return (
    <>
      <p class="text-4xl text-yellow-400 text-center pt-8">sup4bubb4</p>
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
    </>
  );
};

export default Home;
