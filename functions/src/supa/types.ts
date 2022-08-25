import { Request as ExpressRequest } from "express";

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
};

type StreamDetails = {
  actualStartTime: string;
  actualEndTime: string;
  scheduledStartTime: string;
};

type Stream = {
  id: string;
  title: string;
  publishedAt: string;
  duration: string;
  liveStreamingDetails: StreamDetails;
  offset?: number;
};

type Request = {
  body: { offset: number };
  headers: ExpressRequest["headers"];
  params: { streamId: string };
};

export { Song, Stream, Request };
