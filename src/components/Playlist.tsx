import { Component, For } from 'solid-js';
import { Song } from '../utils/types';

interface PlaylistType {
  playlist: Song[];
}

const Playlist: Component<PlaylistType> = (props) => {
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

export default Playlist;
