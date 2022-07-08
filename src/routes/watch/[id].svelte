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
  import { onMount } from 'svelte';
  import type { Song, Stream } from '../../utils/types';

  let SongComponent: any;
  let YoutubeComponent: any;

  onMount(async () => {
    const songModule = await import('../../components/Song.svelte');
    const youtubeModule = await import('../../components/Youtube.svelte');
    SongComponent = songModule.default;
    YoutubeComponent = youtubeModule.default;
  });

  export let stream: Stream;
  export let songs: Song[] = [];

  let streamPlayer: any;
  let streamTime: number;
  let streamState: number;
  let songVolume: number = 10;
</script>

<svelte:head>
  <title>{stream.title}</title>
</svelte:head>

<div class="flex flex-col min-h-screen max-h-screen overflow-hidden">
  <div class="flex flex-grow overflow-hidden w-full">
    <div class="w-full sm:w-full md:w-4/6 lg:w-3/4 xl:w-3/4">
      <svelte:component
        this={YoutubeComponent}
        videoId={stream.id}
        on:CurrentPlayTime={({ detail }) => (streamTime = detail)}
        on:PlayerStateChange={({ detail }) => (streamState = detail)}
        bind:this={streamPlayer}
      />
    </div>

    <div
      class="flex flex-col overflow-hidden w-full sm:w-full md:w-2/6 lg:w-1/4 xl:w-1/4"
    >
      {#if songs.length > 0}
        <svelte:component
          this={SongComponent}
          {streamPlayer}
          {streamTime}
          {streamState}
          {songs}
          {songVolume}
        />
      {:else}
        <p>No bubb4bot</p>
      {/if}
    </div>
  </div>
</div>
