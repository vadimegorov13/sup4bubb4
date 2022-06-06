const API_KEY = "AIzaSyA_U0MD8iQ5X11GzrwAQpfXvxf6rtgVWHg";
const PLAYLIST_ID = "UUyl1z3jo3XHR1riLFKG5UAg";
const SE_ID = "5f9f61c9389f1af859e15be1";
const SE_API = `https://api.streamelements.com/kappa/v2/songrequest/${SE_ID}/history`;
const PLAYLIST_API =
  "https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails";
const VIDEOS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=status%2C%20snippet%2C%20liveStreamingDetails%2C%20contentDetails";

const playlistAPI = (nextPageToken: string, maxResult: number) => {
  return `${PLAYLIST_API}&maxResults=${maxResult}&pageToken=${nextPageToken}&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;
};

export { API_KEY, SE_API, VIDEOS_API, playlistAPI };
