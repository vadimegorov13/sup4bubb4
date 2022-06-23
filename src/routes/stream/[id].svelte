<script context="module">
  import { getSongsTiming } from "../../utils/helperFunctions";

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
  import { onMount } from "svelte";
  // import StreamComponent from "../../components/Stream.svelte";
  import type { Song, Stream } from "../../utils/types";

  export let stream: Stream;
  export let songs: Song[] = [];

  let StreamComponent: any;

  onMount(async () => {
    const module = await import("../../components/Stream.svelte");
    StreamComponent = module.default;
  });
</script>

<svelte:head>
  <title>{stream.title}</title>
</svelte:head>

<div>
  <h1>{stream.title}</h1>
  <svelte:component this={StreamComponent} {stream} {songs} />
</div>
