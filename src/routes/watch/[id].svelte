<script context="module">
  import { convertHMS, getSongsTiming } from '../../utils/helperFunctions';

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

  export let stream: Stream;
  export let songs: Song[] = [];

  let SongComponent: any;
  let YoutubeComponent: any;

  let player: any;
  let time: number;
  let vodState: number;
  let songVolume: number = 10;

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

<div class="flex flex-col min-h-screen max-h-screen overflow-hidden">
  <div class="flex flex-grow overflow-hidden w-full">
    <div class="w-full sm:w-4/6 md:w-4/6 lg:w-3/4 xl:w-3/4">
      <svelte:component
        this={YoutubeComponent}
        videoId={stream.id}
        on:CurrentPlayTime={({ detail }) => (time = detail)}
        on:PlayerStateChange={({ detail }) => (vodState = detail)}
        bind:this={player}
      />
      <!-- <div>
        <p>
          Time: {Math.trunc(time / 60)} minutes and {Math.trunc(
            ((time / 60) % 1) * 60
          )}
          seconds
        </p>

        <p>Or: {Math.floor(time)}</p>
      </div> -->
    </div>

    <div
      class="flex flex-col overflow-hidden w-full sm:w-2/6 md:w-2/6 lg:w-1/4 xl:w-1/4"
    >
      {#if songs.length > 0}
        <div>
          <svelte:component
            this={SongComponent}
            {time}
            {songs}
            {vodState}
            {songVolume}
          />
        </div>
        <ul class="overflow-y-auto">
          {#each songs as song}
            <li>
              {convertHMS(song.startTime)} | {song.title}
            </li>
          {/each}
        </ul>
      {:else}
        <p>No bubb4bot</p>
      {/if}
    </div>
  </div>
</div>
