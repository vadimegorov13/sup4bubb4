<script lang="ts">
  // import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import { playSong } from '../utils/helperFunctions';
  import type { Song } from '../utils/types';

  let YoutubeComponent: any;
  let SongCardComponent: any;

  onMount(async () => {
    const youtubeModule = await import('./Youtube.svelte');
    const songCardModule = await import('./SongCard.svelte');
    YoutubeComponent = youtubeModule.default;
    SongCardComponent = songCardModule.default;
  });

  export let streamPlayer: any;
  export let streamTime: number;
  export let streamState: number;
  export let songs: Song[];
  export let songVolume: number;

  let songPlayer: any;
  let songTime: number;
  let currentSong: Song = songs[0];
  let showControls: boolean = false;

  const changeState = () => {
    if (streamState === 2 || streamState === 3) songPlayer.pause();
    if (streamState === 1 && showControls) songPlayer.play();
  };

  $: streamState && changeState();
  $: streamTime &&
    ({ currentSong, showControls } = playSong(
      streamTime,
      songPlayer,
      songs,
      currentSong,
      songVolume
    ));

  const handleClick = (song: Song) => {
    streamPlayer.setTime(song.startTime);
    streamPlayer.play();
    songPlayer.loadVideoById(song.id);
    songPlayer.setVolume(songVolume);
  };
</script>

<div class={`${showControls ? 'visible' : 'invisible'}`}>
  <svelte:component
    this={YoutubeComponent}
    videoId={currentSong.id}
    on:CurrentPlayTime={({ detail }) => (songTime = detail)}
    bind:this={songPlayer}
  />
</div>

<div class="overflow-y-auto overflow-x-hidden">
  {#each songs as song, i}
    <button on:click={() => handleClick(song)}>
      <svelte:component this={SongCardComponent} {song} {i} />
    </button>
  {/each}
</div>
