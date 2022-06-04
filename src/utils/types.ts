type StreamDetails = {
  actualEndTime: string;
  actualStartTime: string;
  scheduledStartTime: string;
};

export type Stream = {
  id: string;
  liveStreamingDetails: StreamDetails;
  publishedAt: string;
  title: string;
};
