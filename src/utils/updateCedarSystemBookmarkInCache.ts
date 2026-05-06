import { ApolloCache } from '@apollo/client';

const CEDAR_SYSTEM_BOOKMARK_TYPENAMES = [
  'CedarSystem',
  'CedarSystemWorkspaceSystem'
] as const;

export default function updateCedarSystemBookmarkInCache(
  cache: ApolloCache<unknown>,
  cedarSystemId: string,
  isBookmarked: boolean
) {
  CEDAR_SYSTEM_BOOKMARK_TYPENAMES.forEach(__typename => {
    const cacheId = cache.identify({
      __typename,
      id: cedarSystemId
    });

    if (!cacheId) {
      return;
    }

    cache.modify({
      id: cacheId,
      fields: {
        isBookmarked: () => isBookmarked
      }
    });
  });
}
