/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

const config = {
  preprocess: [
    preprocess({
      postcss: true,
      replace: [
        [
          'import.meta.env.VERCEL_ANALYTICS_ID',
          JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
        ],
      ],
    }),
  ],

  kit: {
    adapter: adapter(),
  },
};

export default config;
