<script lang="ts">
  import Icon from '@iconify/svelte';

  let duration = 259;
  let progress = 40;
  let progressString = '00:00';

  const getTimeString = (seconds: number) => {
    let timeString = '';
    timeString += `${
      seconds / 60 < 10
        ? `0${Math.floor(seconds / 60)}:`
        : `${Math.floor(seconds / 60)}:`
    }`;

    timeString += `${
      seconds % 60 < 10 ? `0${seconds % 60}` : `${seconds % 60}`
    }`;

    return timeString;
  };

  const updateProgress = () => {
    progressString = getTimeString(progress);
  };

  $: progress && updateProgress();
</script>

<!-- controls -->
<div class="flex items-center justify-around text-primary px-5">
  <button
    class="bg-[#1b1b1b] rounded-full p-4
        hover:brightness-125
        active:ring-4 ring-ameprimary/30
        transition duration-200 text-ameprimary"
  >
    <Icon icon="fluent:next-16-filled" rotate="90" style="font-size: 16px;" />
  </button>
  <button
    class="bg-[#1b1b1b] rounded-full p-2
        hover:brightness-125
        active:ring-4 ring-ameprimary/30
        transition duration-200 text-ameprimary"
  >
    <Icon icon="fluent:pause-32-filled" style="font-size: 32px;" />
  </button>
  <button
    class="bg-[#1b1b1b] rounded-full p-4
        hover:brightness-125
        active:ring-4 ring-ameprimary/30
        transition duration-200 text-ameprimary"
  >
    <Icon icon="fluent:next-16-filled" style="font-size: 16px;" />
  </button>
</div>

<!-- slider -->
<div class="flex items-center gap-5 mt-8">
  <div class="text-sm opacity-80">{progressString}</div>
  <div class="relative bg-gray-800 w-full h-2 rounded">
    <div
      id="progress-slider"
      class="absolute top-0 left-0 bg-ameprimary h-2 rounded"
      style={`width:${(progress / duration) * 100}%`}
    />
    <input
      name="player"
      type="range"
      bind:value={progress}
      min="0"
      max={duration}
      class="absolute top-0 left-0 w-full h-2 rounded bg-amesecondary/30 outline-none appearance-none"
    />
  </div>
  <div class="text-sm opacity-80">{getTimeString(duration)}</div>
</div>

<style>
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    input[type='range']::-webkit-slider-thumb {
      width: 15px;
      height: 15px;
      -webkit-appearance: none;
      appearance: none;
      cursor: pointer;
      background: #f4d480;
      border-radius: 50%;
    }
  }
</style>
