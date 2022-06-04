import { Link } from 'solid-app-router';
import { Component } from 'solid-js';
import { Stream } from '../utils/types';

interface StreamProps {
  stream: Stream;
}

const StreamCard: Component<StreamProps> = (props) => {
  const stream = () => props.stream;
  return (
    <Link href={`/stream/${stream().id}`}>
      <div class="rounded overflow-hidden shadow-lg">
        <div class="relative h-48">
          <div class="w-full object-cover"></div>
          <img
            class="w-full object-cover"
            src={stream().thumbnail}
            alt={`Thumbnail for ${stream().title}`}
          />
          {/* <div class="absolute bottom-0 inset-x-0 text-white text-md text-right leading-4 p-1.5">
            time here lol
          </div> */}
        </div>

        <div class="px-2 pt-2">
          <div class="font-semibold text-md mb-2">{stream().title}</div>
        </div>
        <div class="px-2 pt-2 pb-2">
          <span class="inline-block bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            date
          </span>
        </div>
      </div>
    </Link>
  );
};

export default StreamCard;
