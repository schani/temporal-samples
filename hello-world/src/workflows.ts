import * as workflow from '@temporalio/workflow';
import type { AutomationNodeRunner } from '@glideapps/automations-test-runner';
import type * as activities from './activities';
import { initAutomations } from './automations';

const { fetchAutomationJSON, fetchRowIDs, evalConditions, runPrimitiveActionNode } = workflow.proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '1 minute',
});

export async function runAutomation(url: string, actionID: string): Promise<void> {
  const automations = await initAutomations();

  const automation = await fetchAutomationJSON(url);
  const ctx = automations.makeContextForApp(automation);
  const runner: AutomationNodeRunner = {
    async fetchRowIDs(actionID: string): Promise<readonly string[]> {
      return await fetchRowIDs(automation, actionID);
    },
    async evalConditions(actionID: string, rowID: string): Promise<number | undefined> {
      return await evalConditions(automation, actionID, rowID);
    },
    async runPrimitiveActionNode(actionID: string, rowID: string, nodeKey: string): Promise<void> {
      return await runPrimitiveActionNode(automation, actionID, rowID, nodeKey);
    },
  };

  await automations.runAutomation(ctx, runner, actionID);
}
