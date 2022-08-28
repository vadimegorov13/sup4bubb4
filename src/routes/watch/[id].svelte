<script lang="ts">
  import type { Song, Stream } from '$lib/types';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  export let stream: Stream;
  export let songs: Song[] = [];

  let streamPlayer: any;
  let streamTime: number;
  let streamState: number;
  let songVolume: number = 10;
  let hideSongList: boolean = false;
  let lastTimeUpdate: number;

  let SongComponent: any;
  let YoutubeComponent: any;

  const handleClick = () => {
    hideSongList = !hideSongList;
  };

  onMount(async () => {
    const songModule = await import('$lib/components/Sidebar.svelte');
    const youtubeModule = await import('$lib/components/Youtube.svelte');
    SongComponent = songModule.default;
    YoutubeComponent = youtubeModule.default;

    streamPlayer.setVolume(100);

    console.log(stream);
  });
</script>

<svelte:head>
  <title>{stream.title}</title>
</svelte:head>

<div class="flex flex-wrap overflow-hidden w-full">
  <div
    class={`w-full ${
      hideSongList
        ? 'min-h-screen max-h-screen'
        : 'aspect-video md:w-8/12 lg:w-8.5/12 xl:10/12 '
    } relative`}
  >
    <svelte:component
      this={YoutubeComponent}
      videoId={stream.id}
      autoplay="1"
      on:CurrentPlayTime={({ detail }) => (streamTime = detail)}
      on:PlayerStateChange={({ detail }) => (streamState = detail)}
      on:LastTimeUpdate={({ detail }) => (lastTimeUpdate = detail)}
      bind:this={streamPlayer}
    />
    {#if hideSongList === true}
      <div class="absolute right-0 top-2">
        <button
          class="bg-transparent p-4 rounded-full transform transition duration-500 hover:bg-zinc-500/[.70]"
          on:click={handleClick}
        >
          <Icon icon="ooui:collapse" rotate="135" style="font-size: 16px;" />
        </button>
      </div>
    {/if}
  </div>

  <div
    class={`w-full md:w-4/12 lg:w-3.5/12 xl:2/12 min-h-screen max-h-screen ${
      hideSongList ? 'hidden' : 'flex flex-col'
    }`}
  >
    {#if songs.length > 0}
      <div class="relative p-4">
        <p class="text-lg text-center">Song Requests</p>
        <div class="absolute left-2 top-2 invisible md:visible">
          <button
            class="bg-transparent p-4 rounded-full transform transition duration-500 hover:bg-zinc-700"
            on:click={handleClick}
          >
            <Icon icon="ooui:collapse" rotate="45" style="font-size: 16px;" />
          </button>
        </div>
      </div>
      <svelte:component
        this={SongComponent}
        {streamPlayer}
        {streamTime}
        {streamState}
        {songs}
        {songVolume}
        {lastTimeUpdate}
      />
    {:else}
      <p>No bubb4bot</p>
    {/if}
  </div>
</div>
