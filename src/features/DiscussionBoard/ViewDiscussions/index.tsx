import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, Icon } from '@trussworks/react-uswds';
import {
  SystemIntakeGRBDiscussionBoardType,
  SystemIntakeGRBReviewDiscussionFragment
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import IconButton from 'components/IconButton';
import useDiscussionParams from 'hooks/useDiscussionParams';

import DiscussionsList from '../_components/DiscussionList';
import DiscussionPost from '../_components/DiscussionPost';
import VisibilitySummary from '../_components/VisibilitySummary';

type ViewDiscussionsProps = {
  discussionBoardType: SystemIntakeGRBDiscussionBoardType;
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
  readOnly?: boolean;
};

/**
 * List of discussions view
 *
 * Displays list of all discussions
 * with links to start a new discussion or reply to existing discussions
 */
const ViewDiscussions = ({
  discussionBoardType,
  grbDiscussions,
  readOnly
}: ViewDiscussionsProps) => {
  const { t } = useTranslation('discussions');

  const { pushDiscussionQuery } = useDiscussionParams();

  const discussionsWithoutReplies: SystemIntakeGRBReviewDiscussionFragment[] =
    grbDiscussions.filter(discussion => discussion.replies.length === 0);

  const discussionsWithReplies: SystemIntakeGRBReviewDiscussionFragment[] =
    grbDiscussions.filter(discussion => discussion.replies.length > 0);

  const VisibilityIcon =
    discussionBoardType === SystemIntakeGRBDiscussionBoardType.INTERNAL
      ? Icon.LockOutline
      : Icon.LockOpen;

  return (
    <div>
      <h1 className="margin-bottom-105">
        {t(`discussionBoardType.${discussionBoardType}`)}
      </h1>

      <p
        className="margin-0 margin-top-05 text-base display-flex flex-align-center"
        data-testid="visibility"
      >
        <VisibilityIcon className="margin-right-05" aria-hidden />
        {t('governanceReviewBoard.visibility', {
          context: discussionBoardType
        })}
      </p>

      <VisibilitySummary discussionBoardType={discussionBoardType} />

      <p className="font-body-lg text-light line-height-body-5 margin-top-105">
        {t('governanceReviewBoard.description', {
          context: discussionBoardType
        })}
      </p>

      <h2 className="margin-top-5 margin-bottom-2">{t('general.label')}</h2>

      {!readOnly && (
        <IconButton
          type="button"
          onClick={() => {
            pushDiscussionQuery({
              discussionBoardType,
              discussionMode: 'start'
            });
          }}
          icon={<Icon.Announcement />}
          unstyled
        >
          {t('general.startNewDiscussion')}
        </IconButton>
      )}

      <Accordion
        className="discussions-list margin-top-5"
        multiselectable
        items={[
          {
            id: 'grbDiscussionsNew',
            title: t('general.newTopics', {
              count: discussionsWithoutReplies.length
            }),
            expanded: true,
            headingLevel: 'h4',
            content:
              discussionsWithoutReplies.length > 0 ? (
                <>
                  <DiscussionsList type="discussions" initialCount={3}>
                    {discussionsWithoutReplies.map((discussion, index) => (
                      <li
                        key={discussion.initialPost.id}
                        className="padding-y-3 padding-x-205"
                      >
                        <DiscussionPost
                          {...discussion.initialPost}
                          replies={discussion.replies}
                          discussionBoardType={discussionBoardType}
                          readOnly={readOnly}
                        />
                      </li>
                    ))}
                  </DiscussionsList>
                </>
              ) : (
                <Alert type="info" className="margin-top-1" slim>
                  {t('general.alerts.noDiscussionsStarted')}
                </Alert>
              )
          },
          {
            id: 'grbDiscussionsWithReplies',
            title: t('general.discussedTopics', {
              count: discussionsWithReplies.length
            }),
            expanded: true,
            headingLevel: 'h4',
            content:
              discussionsWithReplies.length > 0 ? (
                <>
                  <DiscussionsList type="discussions" initialCount={3}>
                    {discussionsWithReplies.map((discussion, index) => (
                      <li
                        key={discussion.initialPost.id}
                        className="padding-y-3 padding-x-205"
                      >
                        <DiscussionPost
                          {...discussion.initialPost}
                          replies={discussion.replies}
                          discussionBoardType={discussionBoardType}
                          readOnly={readOnly}
                        />
                      </li>
                    ))}
                  </DiscussionsList>
                </>
              ) : (
                <Alert type="info" className="margin-top-1" slim>
                  {t('general.alerts.noDiscussionsRepliedTo')}
                </Alert>
              )
          }
        ]}
      />
    </div>
  );
};

export default ViewDiscussions;
