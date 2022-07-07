<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import type { Song } from '../utils/types';

  export let time: number;
  export let songs: Song[];
  export let vodState: number;
  export let songVolume: number;

  let YoutubeComponent: any;

  let player: any;
  let playertime: number;
  let currentSong: Song = songs[0];

  onMount(async () => {
    const module = await import('./Youtube.svelte');
    YoutubeComponent = module.default;
  });

  const getSong = () => {
    if (time < songs[0].startTime) {
      player.pause();
      return;
    }

    songs.map((song, i) => {
      if (
        currentSong !== song &&
        Math.floor(time) >= Math.floor(song.startTime)
      ) {
        if (i === songs.length - 1) {
          currentSong = song;
          player.loadVideoById(currentSong.id, time - currentSong.startTime);
          player.setVolume(songVolume);
          return;
        }

        if (Math.floor(time) < Math.floor(songs[i + 1].startTime)) {
          currentSong = song;
          player.loadVideoById(currentSong.id, time - currentSong.startTime);
          player.setVolume(songVolume);
          return;
        }
      }
    });

    return;
  };

  const changeState = () => {
    if (vodState === 2) player.pause();
    if (vodState === 1) player.play();
  };

  $: time && getSong();
  $: vodState && changeState();
</script>

<svelte:component
  this={YoutubeComponent}
  videoId={currentSong.id}
  on:CurrentPlayTime={({ detail }) => (playertime = detail)}
  bind:this={player}
/>
