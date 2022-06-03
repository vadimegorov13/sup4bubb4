import { useParams } from 'solid-app-router';
import { Match, Switch } from 'solid-js';
import { getStream } from '../utils/hooks';

const Stream = () => {
  const params = useParams();

  const stream = getStream(params.id);
  console.log(stream.data);

  return (
    <Switch>
      <Match when={stream.loading}>
        <p class="text-4xl text-yellow-400 text-center py-20">Loading...</p>
      </Match>
      <Match when={stream.error}>
        <p class="text-4xl text-yellow-400 text-center py-20">
          An error occured
        </p>
      </Match>
      <Match when={stream.data}>
        <p class="text-4xl text-yellow-400 text-center py-20">
          {stream.data.title}
        </p>
      </Match>
    </Switch>
  );
};

export default Stream;
