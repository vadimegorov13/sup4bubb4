import { useParams } from 'solid-app-router';
import { Match, Switch } from 'solid-js';
import Playlist from '../components/Playlist';
import { getStream } from '../utils/hooks';
import { Song } from '../utils/types';

const Stream = () => {
  const params = useParams();

  const [streamData, playlistData] = getStream(params.id);

  return (
    <>
      <Switch>
        <Match when={streamData.loading}>
          <p class="text-4xl text-yellow-400 text-center py-20">Loading...</p>
        </Match>
        <Match when={streamData.error}>
          <p class="text-4xl text-yellow-400 text-center py-20">
            An error occured
          </p>
        </Match>
        <Match when={streamData.data}>
          <p class="text-4xl text-yellow-400 text-center py-20">
            {streamData.data.title}
          </p>
        </Match>
      </Switch>
      <Switch>
        <Match when={playlistData.loading}>
          <p class="text-4xl text-yellow-400 text-center py-20">
            Loading Playlist...
          </p>
        </Match>
        <Match when={playlistData.error}>
          <p class="text-4xl text-yellow-400 text-center py-20">
            An error occured
          </p>
        </Match>
        <Match when={playlistData.data}>
          <Playlist playlist={playlistData.data.playlist as Song[]} />
        </Match>
      </Switch>
    </>
  );
};

export default Stream;
