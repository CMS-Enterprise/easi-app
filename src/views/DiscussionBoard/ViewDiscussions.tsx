import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, Icon } from '@trussworks/react-uswds';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import Alert from 'components/shared/Alert';
import IconButton from 'components/shared/IconButton';

import DiscussionPost from './components/DiscussionPost';

type ViewDiscussionsProps = {
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
};

/**
 * List of discussions view
 *
 * Displays list of all discussions
 * with links to start a new discussion or reply to existing discussions
 */
const ViewDiscussions = ({ grbDiscussions }: ViewDiscussionsProps) => {
  const { t } = useTranslation('discussions');

  // TODO: filter for only new discussions
  const newDiscussions: SystemIntakeGRBReviewDiscussionFragment[] =
    grbDiscussions;

  // TODO: filter for older discussions with replies
  const discussionsWithReplies: SystemIntakeGRBReviewDiscussionFragment[] =
    grbDiscussions;

  return (
    <div>
      <h1 className="margin-bottom-105">
        {t('governanceReviewBoard.internal.label')}
      </h1>
      <p className="font-body-lg text-light line-height-body-5 margin-top-105">
        {t('governanceReviewBoard.internal.description')}
      </p>

      <h2 className="margin-top-5 margin-bottom-2">
        {t('general.discussion')}
      </h2>
      <IconButton
        type="button"
        // TODO: Go to start discussion view
        onClick={() => null}
        icon={<Icon.Announcement />}
        unstyled
      >
        {t('general.startNewDiscussion')}
      </IconButton>

      <Accordion
        className="discussions-list margin-top-5"
        multiselectable
        items={[
          {
            id: 'grbDiscussionsNew',
            title: t('general.newTopics', { count: newDiscussions.length }),
            expanded: true,
            headingLevel: 'h4',
            content:
              newDiscussions.length > 0 ? (
                <>
                  <ul className="usa-list--unstyled">
                    {newDiscussions.map((discussion, index) => (
                      <li
                        key={discussion.initialPost.id}
                        className="padding-y-3 padding-x-205"
                      >
                        <DiscussionPost
                          {...discussion.initialPost}
                          replies={discussion.replies}
                        />
                      </li>
                    ))}
                  </ul>

                  {/* TODO: View more discussions button */}
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
                  <ul className="usa-list--unstyled">
                    {discussionsWithReplies.map((discussion, index) => (
                      <li
                        key={discussion.initialPost.id}
                        className="padding-y-3 padding-x-205"
                      >
                        <DiscussionPost
                          {...discussion.initialPost}
                          replies={discussion.replies}
                        />
                      </li>
                    ))}
                  </ul>

                  {/* TODO: View more discussions button */}
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
