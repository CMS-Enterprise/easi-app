export function isOldFormat(systemID: string): boolean {
  return systemID.startsWith('{') && systemID.endsWith('}');
}

export function convertToNewFormat(systemID: string): string {
  return systemID.slice(1, systemID.length - 1);
}
