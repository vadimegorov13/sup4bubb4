<script lang="ts">
  import type { Song } from '$lib/types';
  import { playSong } from '$lib/utils/helperFunctions';
  import { onMount } from 'svelte';

  let YoutubeComponent: any;
  let SongCardComponent: any;

  onMount(async () => {
    const youtubeModule = await import('$lib/components/Youtube.svelte');
    const songCardModule = await import('$lib/components/SongCard.svelte');
    YoutubeComponent = youtubeModule.default;
    SongCardComponent = songCardModule.default;
  });

  export let streamPlayer: any;
  export let streamTime: number;
  export let streamState: number;
  export let songs: Song[];
  export let songVolume: number;
  export let lastTimeUpdate: number;

  let songPlayer: any;
  let songState: number;
  let currentSong: Song = songs[0];
  let offset = 0;

  $: songState && changeStreamState();
  // when state of the vod changes, change state of the song
  $: streamState && changeSongState();
  // change curentSong depending depending on the time of the vod
  $: streamTime &&
    (currentSong = playSong(
      streamTime,
      lastTimeUpdate,
      songPlayer,
      songState,
      songs,
      currentSong,
      songVolume,
      offset
    ));

  // change state of the song
  const changeSongState = () => {
    if (streamState === 2 || streamState === 3) {
      songPlayer.pause();
      playSong(
        streamTime,
        lastTimeUpdate,
        songPlayer,
        songState,
        songs,
        currentSong,
        songVolume,
        offset
      );
    }
    if (streamState === 0 || streamState === 1) songPlayer.play();
  };

  const changeStreamState = () => {
    if (streamState !== 0 && streamState !== 2 && songState !== 3) {
      streamPlayer.play();
    }
  };

  // change time of the stream to play clicked song
  const handleClick = (song: Song) => {
    streamPlayer.setTime(song.startTime + offset);
    if (song.startTime + offset < streamPlayer.getDuration()) {
      streamPlayer.play();
    } else {
      songPlayer.loadVideoById(song.id);
    }
  };
</script>

<!-- Youtube player -->
<div class="h-2/6">
  <svelte:component
    this={YoutubeComponent}
    videoId={currentSong.id}
    controls={1}
    disablekb={1}
    autoplay={0}
    on:PlayerStateChange={({ detail }) => (songState = detail)}
    bind:this={songPlayer}
  />
</div>

<div class="h-4/6 flex flex-col">
  <div class="flex justify-center m-2 text-sm">
    Offset: <input
      type="number"
      bind:value={offset}
      step="1"
      class="w-14 text-black mx-2 pl-2 outline-none"
    />
    seconds
  </div>

  <!-- List of songs -->
  <div class="flex flex-col overflow-y-scroll overflow-x-hidden no-scrollbar">
    {#each songs as song, i}
      <button on:click={() => handleClick(song)}>
        <svelte:component
          this={SongCardComponent}
          {song}
          {currentSong}
          {i}
          {offset}
        />
      </button>
    {/each}
  </div>
</div>

<style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
