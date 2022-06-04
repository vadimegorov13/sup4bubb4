import { Component, For } from 'solid-js';
import { Song, Stream } from '../utils/types';

interface PlayerProps {
  stream: Stream;
  playlist: Song[];
}

const Player: Component<PlayerProps> = (props) => {
  return (
    <div>
      <p class="text-4xl text-yellow-400 text-center py-20">Song list</p>
      <For each={props.playlist}>
        {(song) => {
          return <li class="text-xl">{song.title}</li>;
        }}
      </For>
    </div>
  );
};

export default Player;
