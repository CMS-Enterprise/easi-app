import { StringParam, useQueryParam } from 'use-query-params';

export default function linkCedarSystemIdQueryString(
  cedarSystemId: string | null | undefined
): string | undefined {
  if (!cedarSystemId) return undefined;
  return `linkCedarSystemId=${encodeURIComponent(cedarSystemId)}`;
}

export function useLinkCedarSystemIdQueryParam(): string | undefined {
  const [linkCedarSystemId] = useQueryParam('linkCedarSystemId', StringParam);
  if (!linkCedarSystemId) return undefined;
  return linkCedarSystemId;
}
