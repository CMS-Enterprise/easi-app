import { ApolloCache, gql, InMemoryCache } from '@apollo/client';

import updateCedarSystemBookmarkInCache from './updateCedarSystemBookmarkInCache';

describe('updateCedarSystemBookmarkInCache', () => {
  let cache: ApolloCache<unknown>;

  beforeEach(() => {
    cache = new InMemoryCache();

    cache.writeFragment({
      id: 'CedarSystem:1',
      fragment: gql`
        fragment CedarSystemBookmarkState on CedarSystem {
          id
          isBookmarked
        }
      `,
      data: {
        __typename: 'CedarSystem',
        id: '1',
        isBookmarked: false
      }
    });

    cache.writeFragment({
      id: 'CedarSystemWorkspaceSystem:1',
      fragment: gql`
        fragment CedarSystemWorkspaceBookmarkState on CedarSystemWorkspaceSystem {
          id
          isBookmarked
        }
      `,
      data: {
        __typename: 'CedarSystemWorkspaceSystem',
        id: '1',
        isBookmarked: false
      }
    });
  });

  it('updates bookmark state for both system cache typenames', () => {
    updateCedarSystemBookmarkInCache(cache, '1', true);

    expect(
      cache.readFragment<{
        __typename: 'CedarSystem';
        id: string;
        isBookmarked: boolean;
      }>({
        id: 'CedarSystem:1',
        fragment: gql`
          fragment CedarSystemBookmarkState on CedarSystem {
            id
            isBookmarked
          }
        `
      })
    ).toEqual({
      __typename: 'CedarSystem',
      id: '1',
      isBookmarked: true
    });

    expect(
      cache.readFragment<{
        __typename: 'CedarSystemWorkspaceSystem';
        id: string;
        isBookmarked: boolean;
      }>({
        id: 'CedarSystemWorkspaceSystem:1',
        fragment: gql`
          fragment CedarSystemWorkspaceBookmarkState on CedarSystemWorkspaceSystem {
            id
            isBookmarked
          }
        `
      })
    ).toEqual({
      __typename: 'CedarSystemWorkspaceSystem',
      id: '1',
      isBookmarked: true
    });
  });
});
