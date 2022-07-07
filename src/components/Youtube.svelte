<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  export let videoId;
  let player;
  let divId = 'player_' + videoId;

  onMount(() => {
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () =>
      window.dispatchEvent(new Event('iframeApiReady'));

    window.addEventListener('iframeApiReady', function (e) {
      player = new YT.Player(divId, {
        videoId,
        playerVars: { rel: 0 },
        events: {
          onReady: playerIsReady,
          onStateChange: playerStateChange,
        },
      });
    });
  });

  export const play = () => {
    player.playVideo();
  };

  export const pause = () => {
    player.pauseVideo();
  };

  export const setTime = (seconds) => {
    player.seekTo(seconds, true);
  };

  export const setVolume = (volume) => {
    player.setVolume(volume);
  };

  export const loadVideoById = (id, startSeconds = 0) => {
    player.loadVideoById(id, startSeconds);
  };

  const dispatch = createEventDispatcher();

  const playerIsReady = () => {
    dispatch('Ready');
    setInterval(() => {
      dispatch('CurrentPlayTime', player.getCurrentTime());
    }, 1000);
  };

  const playerStateChange = ({ data }) => {
    dispatch('PlayerStateChange', data);

    let strReturn = '';
    if (data == -1) {
      strReturn = '(unstarted)';
    }
    if (data == 0) {
      strReturn = '(ended)';
    }
    if (data == 1) {
      strReturn = '(playing)';
    }
    if (data == 2) {
      strReturn = '(paused)';
    }
    if (data == 3) {
      strReturn = '(buffering)';
    }
    if (data == 5) {
      strReturn = '(video cued).';
    }
    dispatch('PlayerStateChangeString', strReturn);
  };
</script>

<div id={divId} class="h-full w-full" />
