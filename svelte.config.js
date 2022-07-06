import autoProcess from 'svelte-preprocess';

const config = {
  preprocess: autoProcess({ postcss: true }),
};

export default config;
