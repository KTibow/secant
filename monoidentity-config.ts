export const MONOIDENTITY_APP_ID = 'secant';
export const MONOIDENTITY_SYNC_FOR = (path: string) =>
  path.startsWith('.config/secant/') ? { mode: 'immediate' } : undefined;
