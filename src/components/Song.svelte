<script lang="ts">
  import { onMount } from 'svelte';
  import { playSong } from '../utils/helperFunctions';
  import type { Song } from '../utils/types';

  export let streamPlayer: any;
  export let streamTime: number;
  export let streamState: number;
  export let songs: Song[];
  export let songVolume: number;
  export let lastTimeUpdate: number;

  let songPlayer: any;
  let songTime: number;
  let currentSong: Song = songs[0];
  let showControls: boolean = true;

  let YoutubeComponent: any;
  let SongCardComponent: any;

  $: streamState && changeState();
  $: streamTime &&
    ({ currentSong, showControls } = playSong(
      streamTime,
      lastTimeUpdate,
      songPlayer,
      songs,
      currentSong,
      songVolume
    ));

  const changeState = () => {
    if (streamState === 2 || streamState === 3) {
      songPlayer.pause();
      playSong(
        streamTime,
        lastTimeUpdate,
        songPlayer,
        songs,
        currentSong,
        songVolume
      );
    }
    if ((streamState === 0 || streamState === 1) && showControls)
      songPlayer.play();
  };

  const handleClick = (song: Song) => {
    streamPlayer.setTime(song.startTime);
    streamPlayer.play();
  };

  onMount(async () => {
    const youtubeModule = await import('./Youtube.svelte');
    const songCardModule = await import('./SongCard.svelte');
    YoutubeComponent = youtubeModule.default;
    SongCardComponent = songCardModule.default;
  });
</script>

<div>
  <svelte:component
    this={YoutubeComponent}
    videoId={currentSong.id}
    controls={0}
    disablekb={1}
    on:CurrentPlayTime={({ detail }) => (songTime = detail)}
    bind:this={songPlayer}
  />
</div>

<div class="flex flex-col overflow-y-auto overflow-x-hidden">
  {#each songs as song, i}
    <button on:click={() => handleClick(song)}>
      <svelte:component this={SongCardComponent} {song} {i} />
    </button>
  {/each}
</div>
