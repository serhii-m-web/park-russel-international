import { existsSync, readFileSync } from 'fs';
import { basename, resolve } from 'path';
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { htmlFiles } from './getHTMLFileNames';
import {
  run as runWebpConversion,
  startWatch as startWebpWatch,
} from './scripts/convertToWebp';
import { pictureHelper } from './scripts/pictureHelper';

const input: Record<string, string> = {
  main: resolve(__dirname, 'src/index.html'),
};

htmlFiles.forEach((file) => {
  input[file.replace('.html', '')] = resolve(__dirname, 'src', file);
});

const loadJson = <T>(filePath: string, fallback: T): T => {
  if (!existsSync(filePath)) return fallback;

  return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
};

const webpPlugin = (): Plugin => ({
  name: 'webp-convert',
  async buildStart() {
    await runWebpConversion();
  },
  configureServer() {
    startWebpWatch();
  },
});

const handlebarsReloadPlugin = (): Plugin => ({
  name: 'handlebars-reload',
  handleHotUpdate({ file, server }) {
    const normalizedPath = file.replace(/\\/g, '/');
    const isPartial =
      normalizedPath.includes('/templates/') ||
      normalizedPath.includes('/sections/') ||
      normalizedPath.includes('/data/');

    if (!isPartial) {
      // Let Vite handle default HMR (including CSS/SCSS).
      return;
    }

    server.ws.send({
      type: 'full-reload',
      path: '*',
    });
    return [];
  },
  configureServer(server: ViteDevServer) {
    server.watcher.add(resolve(__dirname, 'src/templates'));
    server.watcher.add(resolve(__dirname, 'src/sections'));
    server.watcher.add(resolve(__dirname, 'src/data'));
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const enableWebpConvert = env.VITE_WEBP_CONVERT !== 'false';

  return {
    base: './',
    root: 'src',
    publicDir: '../public',
    css: {
      preprocessorOptions: {
        scss: {
          // Silence remaining if() deprecations inside include-media (node_modules).
          quietDeps: true,
          // Vite 4 still uses the legacy Sass JS API; silence until Vite is upgraded.
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    plugins: [
      handlebars({
        partialDirectory: [
          resolve(__dirname, 'src/templates'),
          resolve(__dirname, 'src/sections'),
        ],
        reloadOnPartialChange: true,
        context: {
          site: () =>
            loadJson(resolve(__dirname, 'src/data/site.json'), {
              brand: 'Parker Russell International',
            }),
          page: (pagePath: string) => {
            const pageName = basename(pagePath, '.html');
            return loadJson(
              resolve(__dirname, `src/data/${pageName}.json`),
              {},
            );
          },
        },
        helpers: {
          picture: pictureHelper,
          year: () => String(new Date().getFullYear()),
          upper: (value: unknown) => String(value ?? '').toUpperCase(),
          inc: (value: unknown) => String(Number(value) + 1),
          pad: (value: unknown, totalOrOptions?: unknown) => {
            const raw = String(value ?? '');
            const total =
              typeof totalOrOptions === 'number' ||
              typeof totalOrOptions === 'string'
                ? Number(totalOrOptions)
                : NaN;

            if (!Number.isFinite(total) || total < 10) return raw;
            return raw.padStart(2, '0');
          },
          array: function (...args: unknown[]) {
            const items = args.slice(0, -1);
            return items;
          },
          object: function (...args: unknown[]) {
            const options = args[args.length - 1] as {
              hash?: Record<string, unknown>;
            };
            return options.hash || {};
          },
        },
      }),
      handlebarsReloadPlugin(),
      ...(enableWebpConvert ? [webpPlugin()] : []),
    ],
    build: {
      rollupOptions: {
        input,
      },
      outDir: '../dist/',
      emptyOutDir: true,
    },
    server: {
      host: true,
      open: true,
    },
  };
});

