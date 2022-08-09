<script context="module" lang="ts">
  export async function load({ fetch }: any) {
    const resStreams = await fetch(`https://sup4bubb4.web.app/api/streams`);
    const dataStreams = await resStreams.json();

    if (resStreams.ok) {
      return { props: { streams: dataStreams } };
    } else {
      return {
        status: resStreams.status,
        error: new Error('could not fetch streams'),
      };
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import Footer from '../components/Footer.svelte';
  import Nav from '../components/Nav.svelte';
  import Loading from '../components/Loading.svelte';
  import type { Stream } from '../utils/types';

  export let streams: Stream[];
  let StreamCard: any;
  let loading = true;

  $: isLoaded = streams && !loading;

  onMount(async () => {
    const module = await import('../components/StreamCard.svelte');
    StreamCard = module.default;

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
          <svelte:component this={StreamCard} {stream} />
        {/each}
      </div>

      <Footer />
    {:else}
      <Loading />
    {/if}
  </div>
</div>
