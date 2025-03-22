import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  
  compilerOptions: {
    // Enable run-time checks when not in production
    dev: process.env.NODE_ENV !== 'production',
    // Svelte 4 uses 'injected' instead of boolean
    css: 'injected',
  },
};

export default config;
