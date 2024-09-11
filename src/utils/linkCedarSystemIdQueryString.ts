import { useLocation } from 'react-router-dom';

export default function linkCedarSystemIdQueryString(
  cedarSystemId: string | null | undefined
): string | undefined {
  if (!cedarSystemId) return undefined;
  return `linkCedarSystemId=${encodeURIComponent(cedarSystemId)}`;
}

export function useLinkCedarSystemIdQueryParam(): string | undefined {
  const loc = useLocation();
  const par = new URLSearchParams(loc.search);
  return par.get('linkCedarSystemId') || undefined;
}
