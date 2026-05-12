const PREFIX = "@wuhanperf/joinedEvents:";

export function joinedEventsStorageKey(userId: string): string {
  return `${PREFIX}${userId}`;
}
