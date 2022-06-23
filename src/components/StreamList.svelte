<script lang="ts">
  import { onMount } from "svelte";
  import StreamCard from "./StreamCard.svelte";
  import { getStreams } from "../utils/hooks";
  import type { Stream } from "../utils/types";;

  export let streams: Stream[];
  let loading = true;
  $: isLoaded = streams && !loading;

  onMount(async () => {
    setTimeout(() => {
      loading = false;
    }, 500);

    streams = await getStreams();
  });
</script>

<div
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
>
  {#if isLoaded}
    {#each streams as stream}
      <StreamCard {stream} />
    {/each}
  {:else}
    Loading
  {/if}
</div>
