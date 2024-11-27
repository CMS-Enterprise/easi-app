import { useHistory, useLocation } from 'react-router-dom';

const discussionModeKeys = ['view', 'start', 'reply'] as const;

type DiscussionMode = (typeof discussionModeKeys)[number];

/**
 * Handle Discussion (side panel modal) state with the url query params
 * `discussionMode` and `discussionId`.
 */
export default function useDiscussionParams() {
  const history = useHistory();
  const location = useLocation();

  return {
    getDiscussionParams(): {
      /** Undefined implies a closed modal */
      discussionMode: DiscussionMode | undefined;
      discussionId: string | undefined;
    } {
      const q = new URLSearchParams(location.search);

      const discussionMode = q.get('discussionMode') as DiscussionMode | null;

      // Silent ignore on invalid `discussionModeKeys`
      if (
        discussionMode === null ||
        !discussionModeKeys.includes(discussionMode)
      ) {
        return {
          discussionMode: undefined,
          discussionId: undefined
        };
      }

      // Check reply mode for valid `discussionId`
      // Silent fail if `discussionId` is invalid
      if (discussionMode === 'reply') {
        const discussionId = q.get('discussionId');

        if (discussionId === null)
          return {
            discussionMode: undefined,
            discussionId: undefined
          };

        return { discussionMode, discussionId };
      }

      return { discussionMode, discussionId: undefined };
    },

    /** Push a new url query to update the Discussion subviews state. `false` implies closing the modal */
    pushDiscussionQuery(
      query:
        | { discussionMode: Extract<DiscussionMode, 'view' | 'start'> }
        | {
            discussionMode: Extract<DiscussionMode, 'reply'>;
            discussionId: string;
          }
        | false
    ) {
      if (query === false) {
        history.push(`${location.pathname}`);
        return;
      }

      const querystring = new URLSearchParams(query);
      history.push(`${location.pathname}?${querystring}`);
    }
  };
}
