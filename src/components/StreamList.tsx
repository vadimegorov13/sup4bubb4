import { Component, For } from 'solid-js';

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

interface StreamList {
  streams: Stream[];
}

const StreamList: Component<StreamList> = (props) => {
  return (
    <div>
      <For each={props.streams}>
        {(stream) => {
          return <li>{stream.title}</li>;
        }}
      </For>
      <p class="text-4xl text-yellow-400 text-center py-20"></p>
    </div>
  );
};

export default StreamList;
