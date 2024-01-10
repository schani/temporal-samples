// @@@SNIPSTART typescript-hello-worker
import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';

async function run() {
  // Step 1: Establish a connection with Temporal server.
  //
  // Worker code uses `@temporalio/worker.NativeConnection`.
  // (But in your application code it's `@temporalio/client.Connection`.)
  const connection = await NativeConnection.connect({
    address: 'localhost:7233',
    // TLS and gRPC metadata configuration goes here.
  });
  // Step 2: Register Workflows and Activities with the Worker.
  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'hello-world',
    // Workflows are registered using a path as they run in a separate JS context.
    workflowsPath: require.resolve('./workflows'),
    activities,
    bundlerOptions: {
      ignoreModules: [
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
      ],
      webpackConfigHook: (config) => {
        console.log('webpack config', JSON.stringify(config, undefined, 2));

        if (config.output === undefined) {
          config.output = {};
        }
        config.output.publicPath = '';
        config.target = 'node';
        return config;
      },
    },
  });

  // Step 3: Start accepting tasks on the `hello-world` queue
  //
  // The worker runs until it encounters an unexepected error or the process receives a shutdown signal registered on
  // the SDK Runtime object.
  //
  // By default, worker logs are written via the Runtime logger to STDERR at INFO level.
  //
  // See https://typescript.temporal.io/api/classes/worker.Runtime#install to customize these defaults.
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
// @@@SNIPEND
