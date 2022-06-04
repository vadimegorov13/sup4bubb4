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

type User = {
  providerId: string;
  username: string;
  subscriber?: boolean;
};

export type Song = {
  id: string;
  duration: number;
  title: string;
  channel: string;
  createdAt: string;
  user: User;
};
