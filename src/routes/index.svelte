<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '../firebase/firebase';
  import type { Stream } from '../utils/types';

  let StreamCard: any;
  let streams: Stream[] = [];
  let loading = true;

  $: isLoaded = streams && !loading;

  onMount(async () => {
    const module = await import('../components/StreamCard.svelte');
    StreamCard = module.default;

    await db
      .collection('streams')
      .orderBy('publishedAt', 'desc')
      .get()
      .then((res) => {
        res.forEach((doc: any) => {
          // doc.data() is never undefined for query doc snapshots
          streams.push(doc.data());
        });
      });

    loading = false;
  });
</script>

<svelte:head>
  <title>sup4bubb4</title>
</svelte:head>

<div
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
>
  {#if isLoaded}
    {#each streams as stream}
      <svelte:component this={StreamCard} {stream} />
    {/each}
  {:else}
    Loading
  {/if}
</div>
