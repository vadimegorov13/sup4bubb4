<script context="module">
  import { getSongsTiming } from '../../utils/helperFunctions';

  export async function preload({ params }) {
    const resStream = await this.fetch(
      `https://sup4bubb4.web.app/api/stream/${params.id}`
    );
    const dataStream = await resStream.json();

    const resSongs = await this.fetch(
      `https://sup4bubb4.web.app/api/songs/${params.id}`
    );
    const dataSongs = await resSongs.json();

    const timedSongs = await getSongsTiming(
      dataStream.liveStreamingDetails.actualStartTime,
      dataSongs
    );

    if (resStream.status === 200 && resStream.status === 200) {
      return { stream: dataStream, songs: timedSongs };
    } else {
      this.error(
        [resStream.status, resSongs.status],
        [dataStream.message, dataSongs.message]
      );
    }
  }
</script>

<script lang="ts">
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import type { Song, Stream } from '../../utils/types';

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
    const songModule = await import('../../components/Song.svelte');
    const youtubeModule = await import('../../components/Youtube.svelte');
    SongComponent = songModule.default;
    YoutubeComponent = youtubeModule.default;
  });
</script>

<svelte:head>
  <title>{stream.title}</title>
</svelte:head>

<div class="flex flex-col min-h-screen max-h-screen">
  <div class="flex flex-grow overflow-hidden w-full">
    <div class="w-full relative">
      <svelte:component
        this={YoutubeComponent}
        videoId={stream.id}
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

    <div class={`w-96 ${hideSongList ? 'hidden' : 'flex flex-col'}`}>
      {#if songs.length > 0}
        <div class="relative border-b-2 border-ameprimary p-4">
          <p class="text-lg text-center">Song Requests</p>
          <div class="absolute left-2 top-2">
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
</div>
