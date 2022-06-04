import { Component, For } from 'solid-js';
import { Stream } from '../utils/types';
import StreamCard from './StreamCard';

interface StreamListProps {
  streams: Stream[];
}

const StreamList: Component<StreamListProps> = (props) => {
  return (
    <div class="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      <For each={props.streams}>
        {(stream) => {
          return <StreamCard stream={stream} />;
        }}
      </For>
    </div>
  );
};

export default StreamList;
