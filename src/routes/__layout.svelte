<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  export const load: Load = async ({ props: { params, path } }) => {
    return {
      props: {
        params,
        path,
      },
    };
  };
</script>

<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { webVitals } from '$lib/webvitals';

  let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID as string;
  export let path: string;
  export let params: Record<string, string>;

  page.subscribe((page) => {
    path = page.url.href;
    params = page.params;
  });

  console.log('path:', path);
  console.log('params:', params);

  onMount(() => {
    if (analyticsId) webVitals({ path, params, analyticsId });
  });
</script>

<div style="background-color: #181818" class="min-h-screen text-white">
  <slot />
</div>
