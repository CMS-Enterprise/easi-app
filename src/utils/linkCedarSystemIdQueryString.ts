export default function linkCedarSystemIdQueryString(
  cedarSystemId: string | null | undefined
): string | undefined {
  if (!cedarSystemId) return undefined;
  return `linkCedarSystemId=${encodeURIComponent(cedarSystemId)}`;
}
