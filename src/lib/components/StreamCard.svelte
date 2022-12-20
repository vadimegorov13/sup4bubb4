<script lang="ts">
  import type { Stream } from '$lib/types';
  import { getTime } from '$lib/utils/helperFunctions';
  import { fade } from 'svelte/transition';

  export let stream: Stream;
  const { date, durationStr } = getTime(stream);
</script>

<div
  transition:fade={{ delay: 100, duration: 1000 }}
  class="overflow-hidden shadow-lg transform transition duration-500 hover:scale-110"
>
  <a sapper:prefetch rel="external" href={`watch/${stream.id}`}>
    <div class="relative">
      <img
        class="w-full"
        src={`http://img.youtube.com/vi/${stream.id}/mqdefault.jpg`}
        alt={`Thumbnail for ${stream.title}`}
      />
      <div
        class="absolute bottom-0 inset-x-0 text-white text-xs text-right leading-4 p-1.5"
      >
        <div class="inline-block bg-black bg-opacity-80 p-1">
          {durationStr}
        </div>
      </div>
    </div>

    <div class="px-2 pt-2">
      <div class="font-semibold text-sm mb-2 text-white">
        {stream.title}
      </div>
    </div>
    <div class="px-2 pt-2 pb-2">
      <p
        class="leading-3 px-3 py-1 text-xs font-semibold text-gray-400 mr-2 mb-2"
      >
        Streamed on {date}
      </p>
    </div></a
  >
</div>
