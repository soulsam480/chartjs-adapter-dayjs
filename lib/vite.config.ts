import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: 'chartjs-adapter-dayjs',
      entry: './src/index.ts',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['chart.js'],
      output: {
        globals: {
          'chart.js': 'Chart',
          'chart.js/helpers': 'Chart.helpers',
        },
      },
    },
  },
});
