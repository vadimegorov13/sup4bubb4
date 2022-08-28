<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Loading from '$lib/components/Loading.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import StreamCard from '$lib/components/StreamCard.svelte';
  import type { Stream } from '$lib/types';
  import { onMount } from 'svelte';

  export let streams: Stream[];
  let loading = true;

  $: isLoaded = streams && !loading;

  onMount(async () => {
    loading = false;
  });
</script>

<svelte:head>
  <title>sup4bubb4</title>
</svelte:head>

<Nav />

<div class="container p-10 mx-auto">
  <div class="h-full w-full">
    {#if isLoaded}
      <div class="flex items-center pb-10">
        <p class="font-semibold text-xl mx-auto text-ameprimary">
          {streams.length}
          {streams.length % 10 === 1 ? 'stream' : 'streams'} with bubb4bot
        </p>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
      >
        {#each streams as stream}
          <StreamCard {stream} />
        {/each}
      </div>

      <Footer />
    {:else}
      <Loading />
    {/if}
  </div>
</div>
