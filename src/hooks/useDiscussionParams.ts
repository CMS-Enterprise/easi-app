import { useHistory, useLocation } from 'react-router-dom';
import { SystemIntakeGRBDiscussionBoardType } from 'gql/generated/graphql';

const discussionModeKeys = ['view', 'start', 'reply'] as const;

export type DiscussionMode = (typeof discussionModeKeys)[number];

export type UseDiscussionParamsReturn = {
  /**
   * Get discussion board query parameters
   *
   * Undefined `discussionMode` implies closed modal
   */
  getDiscussionParams: () => {
    discussionBoardType: SystemIntakeGRBDiscussionBoardType | undefined;
    discussionMode: DiscussionMode | undefined;
    discussionId: string | undefined;
  };
  /**
   * Push a new url query to update the Discussion subviews state.
   *
   * `false` implies closing the modal
   */
  pushDiscussionQuery: (
    query:
      | {
          discussionMode: Extract<DiscussionMode, 'view' | 'start'>;
          discussionBoardType: SystemIntakeGRBDiscussionBoardType;
        }
      | {
          discussionMode: Extract<DiscussionMode, 'reply'>;
          discussionBoardType: SystemIntakeGRBDiscussionBoardType;
          discussionId: string;
        }
      | false
  ) => void;
};

function discussionModeIsValid(
  discussionMode: DiscussionMode | string | null
): discussionMode is DiscussionMode {
  return (
    discussionMode !== null &&
    discussionModeKeys.includes(discussionMode as DiscussionMode)
  );
}

function discussionBoardTypeIsValid(
  discussionBoardType: SystemIntakeGRBDiscussionBoardType | string | null
): discussionBoardType is SystemIntakeGRBDiscussionBoardType {
  return (
    discussionBoardType !== null &&
    discussionBoardType in SystemIntakeGRBDiscussionBoardType
  );
}

/**
 * Handle Discussion (side panel modal) state with the url query params
 * `discussionMode` and `discussionId`.
 */
export default function useDiscussionParams(): UseDiscussionParamsReturn {
  const history = useHistory();
  const location = useLocation();

  const getDiscussionParams: UseDiscussionParamsReturn['getDiscussionParams'] =
    () => {
      const q = new URLSearchParams(location.search);

      const discussionMode = q.get('discussionMode');
      const discussionId = q.get('discussionId');

      const discussionBoardType =
        q.get('discussionBoardType') ||
        SystemIntakeGRBDiscussionBoardType.PRIMARY;

      // Silent fail on invalid query params
      if (
        !discussionModeIsValid(discussionMode) ||
        !discussionBoardTypeIsValid(discussionBoardType)
      ) {
        return {
          discussionBoardType: undefined,
          discussionMode: undefined,
          discussionId: undefined
        };
      }

      // Check reply mode for valid `discussionId`
      // Silent fail if `discussionId` is invalid
      if (discussionMode === 'reply') {
        if (discussionId === null)
          return {
            discussionBoardType: undefined,
            discussionMode: undefined,
            discussionId: undefined
          };

        return {
          discussionMode,
          discussionBoardType,
          discussionId
        };
      }

      return { discussionMode, discussionBoardType, discussionId: undefined };
    };

  const pushDiscussionQuery: UseDiscussionParamsReturn['pushDiscussionQuery'] =
    query => {
      if (query === false) {
        history.push(`${location.pathname}`);
        return;
      }

      const querystring = new URLSearchParams(query);
      history.push(`${location.pathname}?${querystring}`);
    };

  return {
    getDiscussionParams,
    pushDiscussionQuery
  };
}
