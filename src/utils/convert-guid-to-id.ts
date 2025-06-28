const guidRegex = /[^/]+$/;

export function convertGuidToId(guid: string): string {
  const match = guidRegex.exec(guid);
  return match ? match[0] : guid;
}
