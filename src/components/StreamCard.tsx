import { Link } from 'solid-app-router';
import { Component } from 'solid-js';
import { getTime } from '../utils/helperFunctions';
import { Stream } from '../utils/types';

interface StreamProps {
  stream: Stream;
}

const StreamCard: Component<StreamProps> = (props) => {
  const stream = () => props.stream;
  const { date, duration } = getTime(stream());

  return (
    <div class="rounded overflow-hidden shadow-lg transform transition duration-500 hover:scale-110">
      <Link href={`/stream/${stream().id}`}>
        <div class="relative">
          <img
            class="w-full"
            src={`http://img.youtube.com/vi/${stream().id}/mqdefault.jpg`}
            alt={`Thumbnail for ${stream().title}`}
          />
          <div class="absolute bottom-0 inset-x-0 text-white text-xs text-right leading-4 p-1.5">
            <div class="inline-block bg-black bg-opacity-80 p-1">
              {duration}
            </div>
          </div>
        </div>

        <div class="px-2 pt-2">
          <div class="font-semibold text-sm mb-2 text-white">
            {stream().title}
          </div>
        </div>
        <div class="px-2 pt-2 pb-2">
          <p class="leading-3 px-3 py-1 text-xs font-semibold text-gray-400 mr-2 mb-2">
            Streamed {date}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default StreamCard;
