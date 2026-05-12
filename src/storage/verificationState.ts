export function verificationStorageKey(userId: string): string {
  return `@wuhanperf/verification:${userId}`;
}
