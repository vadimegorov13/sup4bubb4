<script lang="ts">
  import type { Song } from '../utils/types';
  import { fade } from 'svelte/transition';
  import { convertHMS } from '../utils/helperFunctions';

  export let song: Song;
  export let i: number;
</script>

<div
  transition:fade={{ delay: 100, duration: 1000 }}
  class="w-full overflow-hidden shadow-lg transform transition duration-500 hover:scale-110"
>
  <div class="flex flex-col">
    <div class="flex flex-grow">
      <div class="w-full sm:w-2/6 md:w-2/6 lg:w-1/4 xl:w-1/4">
        <div class="h-full">
          <img
            src={`http://img.youtube.com/vi/${song.id}/mqdefault.jpg`}
            alt={`Thumbnail for ${song.title}`}
            class="object-cover h-full w-full"
          />
        </div>
      </div>

      <div
        class="flex flex-col w-full sm:w-4/6 md:w-4/6 lg:w-3/4 xl:w-3/4 p-2 text-left"
      >
        <p class="font-semibold text-sm mb-2">
          {i + 1}. {song.title}
        </p>
        <p class="text-xs">
          Starts at
          <span class="text-ameprimary">
            {convertHMS(song.startTime)}
          </span>
        </p>
      </div>
    </div>
  </div>
</div>
