<script>
  // @ts-nocheck

  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  export let videoId;
  export let controls = 1;
  export let disablekb = 0;
  export let autoplay = 0;

  let player;
  let divId = 'player_' + videoId;
  let lastTimeUpdate = 0;
  let iframeWindow;

  const dispatch = createEventDispatcher();

  onMount(() => {
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    console.log(firstScriptTag);
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () =>
      window.dispatchEvent(new Event('iframeApiReady'));

    window.postMessage = () => window.dispatchEvent(new Event('message'));

    window.addEventListener('iframeApiReady', function (e) {
      player = new YT.Player(divId, {
        videoId,
        playerVars: {
          rel: 0,
          autoplay: autoplay,
          controls: controls,
          disablekb: disablekb,
        },
        events: {
          onReady: playerIsReady,
          onStateChange: playerStateChange,
        },
      });

      iframeWindow = player.getIframe().contentWindow;
    });

    // Listen to events triggered by postMessage.
    window.addEventListener('message', function (event) {
      // Check that the event was sent from the YouTube IFrame.
      if (event.source === iframeWindow) {
        const data = JSON.parse(event.data);

        // The "infoDelivery" event is used by YT to transmit any
        // kind of information change in the player,
        // such as the current time or a playback quality change.
        if (
          data.event === 'infoDelivery' &&
          data.info &&
          data.info.currentTime
        ) {
          // currentTime is emitted very frequently,
          // but we only care about whole second changes.
          const time = Math.floor(data.info.currentTime);

          if (time !== lastTimeUpdate) {
            lastTimeUpdate = time;
            dispatch('LastTimeUpdate', lastTimeUpdate);
          }
        }
      }
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

  export const getDuration = () => {
    return player.getDuration();
  };

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
