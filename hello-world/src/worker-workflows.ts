import { Worker } from '@temporalio/worker';
import { connectToTemporal } from './worker';

const ignoreModules = [
  'jsdom',
  'jsonata',
  'web-ffmpeg2',
  'buffer',
  'child_process',
  'crypto',
  'fs',
  'http',
  'http2',
  'https',
  'net',
  'os',
  'path',
  'process',
  'stream',
  'tls',
  'url',
  'zlib',
  'fs',
  'crypto',
  'buffer',
  'path',
  'vm',
  'events',
  'perf_hooks',
  'util',
  'http',
  'https',
  'stream',
  'zlib',
  'punycode/',
  'punycode',
  'child_process',
  'os',
  'net',
  'tls',
  'string_decoder',
  'process',
  'tty',
  'querystring',
  'http2',
  'async_hooks',
  'readline',
];

async function run() {
  const connection = await connectToTemporal();
  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'hello-world',
    // Workflows are registered using a path as they run in a separate JS context.
    workflowsPath: require.resolve('./workflows'),
    bundlerOptions: {
      ignoreModules,
      webpackConfigHook: (config) => {
        console.log('webpack config', JSON.stringify(config, undefined, 2));

        if (config.output === undefined) {
          config.output = {};
        }
        config.output.publicPath = '';
        config.target = 'node';
        config.resolve = {
          ...config.resolve,
          fallback: {
            ...config.resolve?.fallback,
            ...Object.fromEntries(ignoreModules.map((m) => [m, false])),
          },
        };
        return config;
      },
    },
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
