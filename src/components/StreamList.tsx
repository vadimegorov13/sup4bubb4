import { Component, For } from 'solid-js';
import { sortByDate } from '../utils/helperFunctions';
import { Stream } from '../utils/types';
import StreamCard from './StreamCard';

interface StreamListProps {
  streams: Stream[];
}

const StreamList: Component<StreamListProps> = (props) => {
  const streams = () => props.streams;
  const sortedStreams = sortByDate(streams());

  return (
    <div class="container p-10 mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <For each={sortedStreams}>
          {(stream) => {
            return <StreamCard stream={stream} />;
          }}
        </For>
      </div>
    </div>
  );
};

export default StreamList;
