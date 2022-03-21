import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Markdown from 'vite-plugin-md';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __VUE_OPTIONS_API__: false,
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Markdown(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: ['src/4_components'],
      dts: true,
    }),
  ],
});
