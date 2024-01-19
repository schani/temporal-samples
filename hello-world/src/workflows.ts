import * as workflow from '@temporalio/workflow';
import type * as activities from './activities';
import { defined } from '@glideapps/ts-necessities';

const { fetchAutomationJSON, fetchRowIDs, evalConditions, runPrimitiveActionNode } = workflow.proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '1 minute',
});

export async function runAutomation(url: string, actionID: string): Promise<void> {
  const automation = await fetchAutomationJSON(url);

  const [, builderAction] = automation.builderActions.find(([id]: [id: string]) => id === actionID) ?? [];
  if (builderAction === undefined) throw new Error(`No builder action found with ID ${actionID}`);

  // const ctx = automations.makeContextForApp(automation);

  const rowIDs = await fetchRowIDs(automation, actionID);

  async function runFlow(rowID: string, flow: any) {
    for (const primitive of flow.actions) {
      await runPrimitiveActionNode(automation, actionID, rowID, primitive.key);
    }
  }

  for (const rowID of rowIDs) {
    const index = await evalConditions(automation, actionID, rowID);
    if (index !== undefined) {
      await runFlow(rowID, defined(builderAction.action.conditionalFlows[index]).flow);
    } else if (builderAction.action.elseFlow !== undefined) {
      await runFlow(rowID, builderAction.action.elseFlow);
    }
  }
}
