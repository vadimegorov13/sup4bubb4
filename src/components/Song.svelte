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

  let YoutubeComponent: any;
  let SongCardComponent: any;

  // when state of the vod changes, change state of the song
  $: streamState && changeState();
  // change curentSong depending depending on the time of the vod
  $: streamTime &&
    (currentSong = playSong(
      streamTime,
      lastTimeUpdate,
      songPlayer,
      songs,
      currentSong,
      songVolume
    ));

  // change state of the song
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
    if (streamState === 0 || streamState === 1) songPlayer.play();
  };

  // change time of the stream to play clicked song
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

<!-- Youtube player -->
<div>
  <svelte:component
    this={YoutubeComponent}
    videoId={currentSong.id}
    controls={1}
    disablekb={1}
    on:CurrentPlayTime={({ detail }) => (songTime = detail)}
    bind:this={songPlayer}
  />
</div>

<!-- List of songs -->
<div class="flex flex-col overflow-y-auto overflow-x-hidden scroll-hidden">
  {#each songs as song, i}
    <button on:click={() => handleClick(song)}>
      <svelte:component this={SongCardComponent} {song} {i} />
    </button>
  {/each}
</div>
