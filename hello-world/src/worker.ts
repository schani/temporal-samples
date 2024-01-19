import { NativeConnection } from '@temporalio/worker';

export async function connectToTemporal(): Promise<NativeConnection> {
  const connection = await NativeConnection.connect({
    address: 'localhost:7233',
    // TLS and gRPC metadata configuration goes here.
  });
  return connection;
}
