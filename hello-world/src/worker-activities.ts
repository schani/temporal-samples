import { Worker } from '@temporalio/worker';
import * as activities from './activities';
import fetch from 'node-fetch';
import { connectToTemporal } from './worker';

(global as any).fetch = fetch;

async function run() {
  const connection = await connectToTemporal();
  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'hello-world',
    activities,
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
