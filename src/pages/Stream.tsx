import { useParams } from 'solid-app-router';
import { lazy, Match, Switch } from 'solid-js';
import { getStream } from '../utils/hooks';
import { Song, Stream } from '../utils/types';

const Player = lazy(() => import('../components/Player'));

const StreamPage = () => {
  const [streamData, playlistData] = getStream(useParams().id);

  return (
    <Switch>
      <Match when={streamData.loading || playlistData.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={streamData.error || playlistData.error}>
        <p>An error occured</p>
      </Match>
      <Match when={streamData.data && playlistData.data}>
        <Player
          stream={streamData.data as Stream}
          playlist={playlistData.data.playlist as Song[]}
        />
      </Match>
    </Switch>
  );
};

export default StreamPage;
