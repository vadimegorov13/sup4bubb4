import moment from 'moment';
import { Stream } from './types';
import { parse } from 'iso8601-duration';

const parseDuration = (duration: string) => {
  const parsedDuration = parse(duration);

  return `${parsedDuration.hours}:${
    parsedDuration.minutes / 10 < 1
      ? `0${parsedDuration.minutes}`
      : parsedDuration.minutes
  }:${
    parsedDuration.seconds / 10 < 1
      ? `0${parsedDuration.seconds}`
      : parsedDuration.seconds
  }`;
};

export const getTime = (stream: Stream) => {
  const date = moment.parseZone(stream.publishedAt).fromNow();
  const duration = parseDuration(stream.duration);

  return { date, duration };
};

export const sortByDate = (streams: Stream[]) => {
  const sortedArray = streams
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  return sortedArray;
};
