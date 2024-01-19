let didInit = false;

export async function initAutomations() {
  // bla
  console.log('yo');
  const automations = await import('@glideapps/automations-test-runner');
  if (!didInit) {
    didInit = true;
    automations.initAutomations();
  }

  return automations;
}
