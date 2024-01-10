import * as automations from '@glideapps/automations-test-runner';

let didInit = false;

export async function initAutomations() {
  if (!didInit) {
    didInit = true;
    automations.initAutomations();
  }

  return automations;
}
