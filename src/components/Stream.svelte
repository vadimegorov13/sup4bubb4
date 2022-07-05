<script lang="ts">
  import type { Song as SongType, Stream } from "../utils/types";
  import { convertHMS } from "../utils/helperFunctions";
  import Song from "./Song.svelte";
  import Youtube from "./Youtube.svelte";

  export let stream: Stream;
  export let songs: SongType[];

  let player: any;
  let time: number;
  let vodState: number;
  let songVolume: number = 10;
</script>



<div class="w-screen h-screen">
  <div class="w-full h-full">
    <Youtube
      videoId={stream.id}
      on:CurrentPlayTime={({ detail }) => (time = detail)}
      on:PlayerStateChange={({ detail }) => (vodState = detail)}
      bind:this={player}
    />
  </div>

  <div>
    <p>
      Time: {Math.trunc(time / 60)} minutes and {Math.trunc(
        ((time / 60) % 1) * 60
      )}
      seconds
    </p>

    <p>Or: {Math.floor(time)}</p>
  </div>

  <Song {time} {songs} {vodState} {songVolume} />

  {#each songs as song}
    <div>
      <li>
        {convertHMS(song.startTime)} | {song.title}
      </li>
    </div>
  {/each}
</div>
