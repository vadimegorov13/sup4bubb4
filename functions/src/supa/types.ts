import { Request as ExpressRequest } from 'express';

type User = {
  providerId: string;
  username: string;
  subscriber?: boolean;
};

type Song = {
  id: string;
  duration: number;
  title: string;
  channel: string;
  createdAt: string;
  user: User;
  startTime?: number;
};

type VodDetails = {
  actualStartTime: string;
  actualEndTime: string;
  scheduledStartTime: string;
};

type Vod = {
  id: string;
  title: string;
  publishedAt: string;
  duration: string;
  liveStreamingDetails: VodDetails;
  offset?: number;
};

type Body = {
  vodId: string;
  fromVodId: string;
  toVodId: string;
  songId: string;
  newStartTime: number;
  changeAll: boolean;
};

type Request = {
  body: Body;
  headers: ExpressRequest['headers'];
  params: { vodId: string };
};

export { Song, Vod, Request };
