export default function linkCedarSystemIdQueryString(
  cedarSystemId: string
): string {
  return `linkCedarSystemId=${encodeURIComponent(cedarSystemId)}`;
}
