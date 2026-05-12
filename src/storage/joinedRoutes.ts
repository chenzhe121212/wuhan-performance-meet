const PREFIX = "@wuhanperf/joinedRoutes:";

export function joinedRoutesStorageKey(userId: string): string {
  return `${PREFIX}${userId}`;
}
