// https://github.com/vitejs/vite/discussions/3448
import path from 'path';
import { defineConfig, transformWithEsbuild, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import svgr from 'vite-plugin-svgr'; // 新增

// ----------------------------------------------------------------------

export default defineConfig(({ command, mode }) => {
  const root = process.cwd();
  const env = loadEnv(process.env.NODE_ENV ?? mode, root);

  return {
    plugins: [
      {
        name: 'treat-js-files-as-jsx',
        async transform(code, id) {
          if (!/src\/.*\.js$/.test(id)) {
            return null;
          }

          // Use the exposed transform from vite, instead of directly
          // transforming with esbuild
          return transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic'
          });
        }
      },
      react(),
      jsconfigPaths(),
      svgr({ include: 'src/assets/images/**/*.svg?react' })
    ],
    // https://github.com/jpuri/react-draft-wysiwyg/issues/1317
    //   define: {
    //     global: 'window'
    //   },
    resolve: {
      alias: [
        // {
        //   find: /^~(.+)/,
        //   replacement: path.join(process.cwd(), 'node_modules/$1')
        // },
        // {
        //   find: /^src(.+)/,
        //   replacement: path.join(process.cwd(), 'src/$1')
        // },
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        }
      ]
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx'
        }
      }
    },
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_REACT_APP_SERVER || 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    preview: {
      // this ensures that the browser opens upon preview start
      open: true,
      // this sets a default port to 3000
      port: 3010
    }
  };
});
