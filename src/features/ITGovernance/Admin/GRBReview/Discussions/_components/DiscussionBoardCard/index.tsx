import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import {
  SystemIntakeGRBDiscussionBoardType,
  SystemIntakeGRBReviewDiscussionFragment
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import IconButton from 'components/IconButton';
import useDiscussionParams from 'hooks/useDiscussionParams';

import RecentDiscussion from '../RecentDiscussion';

type DiscussionBoardCardProps = {
  discussionBoardType: SystemIntakeGRBDiscussionBoardType;
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
  grbReviewStartedAt: string | null | undefined;
  loading: boolean;
  readOnly?: boolean;
};

/**
 * Displays discussion board information and most recent activity
 */
const DiscussionBoardCard = ({
  discussionBoardType,
  grbDiscussions,
  grbReviewStartedAt,
  loading,
  readOnly
}: DiscussionBoardCardProps) => {
  const { t } = useTranslation('discussions');

  const { pushDiscussionQuery } = useDiscussionParams();

  const discussionsWithoutRepliesCount = grbDiscussions.filter(
    discussion => discussion.replies.length === 0
  ).length;

  const VisibilityIcon =
    discussionBoardType === SystemIntakeGRBDiscussionBoardType.INTERNAL
      ? Icon.LockOutline
      : Icon.LockOpen;

  return (
    <div className="internal-discussion-board bg-white padding-3 padding-bottom-4 margin-top-4 border-base-lighter shadow-2">
      <div className="internal-discussions-board__header desktop:display-flex flex-align-start">
        <h3 className="margin-top-0 margin-bottom-1">
          {t('governanceReviewBoard.boardType', {
            context: discussionBoardType
          })}
        </h3>

        <p className="margin-0 margin-top-05 text-base display-flex text-no-wrap">
          <VisibilityIcon className="margin-right-05" />
          {t('governanceReviewBoard.visibility', {
            context: discussionBoardType
          })}
        </p>

        <Button
          type="button"
          onClick={() => {
            pushDiscussionQuery({
              discussionBoardType,
              discussionMode: 'view'
            });
          }}
          className="margin-right-0 margin-y-2 desktop:margin-y-0 text-no-wrap"
          disabled={!grbReviewStartedAt}
          outline
        >
          {t('general.viewDiscussionBoard')}
        </Button>
      </div>

      {/* Discussions without replies */}
      <div className="display-flex">
        <p className="margin-0 margin-right-105 display-flex">
          {discussionsWithoutRepliesCount > 0 && (
            <Icon.Warning
              className="text-warning-dark margin-right-05"
              aria-label="warning icon"
            />
          )}

          {t('general.discussionsWithoutReplies', {
            count: discussionsWithoutRepliesCount
          })}
        </p>

        {discussionsWithoutRepliesCount > 0 && (
          <IconButton
            type="button"
            onClick={() => {
              pushDiscussionQuery({
                discussionBoardType,
                discussionMode: 'view'
              });
            }}
            icon={<Icon.ArrowForward />}
            iconPosition="after"
            unstyled
          >
            {t('general.view')}
          </IconButton>
        )}
      </div>

      {grbReviewStartedAt ? (
        <RecentDiscussion
          loading={loading}
          discussionBoardType={discussionBoardType}
          grbDiscussions={grbDiscussions}
          pushDiscussionQuery={pushDiscussionQuery}
          readOnly={readOnly}
        />
      ) : (
        <Alert type="info" slim>
          {t('general.alerts.reviewNotStarted')}
        </Alert>
      )}
    </div>
  );
};

export default DiscussionBoardCard;
