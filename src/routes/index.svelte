<script lang="ts">
  import { onMount } from "svelte";

  let StreamList;

  onMount(async () => {
    const module = await import("../components/StreamList.svelte");
    StreamList = module.default;
  });
</script>

<svelte:head>
  <title>sup4bubb4</title>
</svelte:head>

<svelte:component this={StreamList} />
