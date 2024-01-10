// @@@SNIPSTART typescript-hello-client
import { Connection, Client } from '@temporalio/client';
import { runAutomation } from './workflows';
import { nanoid } from 'nanoid';

async function run() {
  // Connect to the default Server location
  const connection = await Connection.connect({ address: 'localhost:7233' });
  // In production, pass options to configure TLS and other settings:
  // {
  //   address: 'foo.bar.tmprl.cloud',
  //   tls: {}
  // }

  const client = new Client({
    connection,
    // namespace: 'foo.bar', // connects to 'default' namespace if not specified
  });

  const handle = await client.workflow.start(runAutomation, {
    taskQueue: 'hello-world',
    args: [
      'https://gist.githubusercontent.com/schani/4024e1eb210fb2c49867d0c9ef2c47b1/raw/eab04dfaf60bb3025ae683bf2d06af18750f4628/automation.json',
      'GwWsNZvJ9GJYoKYzs1wm',
    ],
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: 'workflow-' + nanoid(),
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  console.log(await handle.result()); // Hello, Temporal!
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
// @@@SNIPEND
