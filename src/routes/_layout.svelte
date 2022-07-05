<script lang="ts">
  import Nav from "../components/Nav.svelte";

  export let segment: string;
</script>

<div style="background-color: #181818" class="min-h-screen text-white">
  <Nav {segment} />

  {#if segment === "watch"}
    <slot />
  {:else}
    <div class="container p-10 mx-auto">
      <slot />
    </div>
  {/if}
</div>
