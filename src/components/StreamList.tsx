import { Link } from 'solid-app-router';
import { Component, For } from 'solid-js';
import { Stream } from '../utils/types';

interface StreamList {
  streams: Stream[];
}

const StreamList: Component<StreamList> = (props) => {
  return (
    <div>
      <For each={props.streams}>
        {(stream) => {
          return <Link href={`/stream/${stream.id}`}>{stream.title}</Link>;
        }}
      </For>
      <p class="text-4xl text-yellow-400 text-center py-20"></p>
    </div>
  );
};

export default StreamList;
