import { resolve, join } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
    }),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json'
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "${join(__dirname, './src/styles/mixins.scss')}" as *;
        `
      }
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FeedbackTools',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom'
      ],
      output: {
        assetFileNames: 'index.[ext]',
        globals: {
          react: 'React',
          'react/jsx-runtime': 'jsxRuntime',
          'react-dom': 'ReactDOM'
        },
      },
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  }
});
