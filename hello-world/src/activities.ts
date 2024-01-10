import fetch from 'node-fetch';
import { initAutomations } from './automations';

export async function fetchAutomationJSON(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch automation JSON: ${response.statusText}`);
  const data = await response.json();
  return data;
}

export async function fetchRowIDs(automation: any, actionID: string): Promise<readonly string[]> {
  const automations = await initAutomations();

  const ctx = automations.makeContextForApp(automation);
  return await automations.fetchRowIDs(ctx, actionID);
}

export async function evalConditions(automation: any, actionID: string, rowID: string): Promise<number | undefined> {
  const automations = await initAutomations();

  const ctx = automations.makeContextForApp(automation);
  return await automations.evalConditions(ctx, actionID, rowID);
}

export async function runPrimitiveActionNode(
  automation: any,
  actionID: string,
  rowID: string,
  nodeKey: string
): Promise<void> {
  const automations = await initAutomations();

  const ctx = automations.makeContextForApp(automation);
  return await automations.runPrimitiveActionNode(ctx, actionID, rowID, nodeKey);
}
