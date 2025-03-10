import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import DiscussionPost from 'features/DiscussionBoard/DiscussionPost';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { getMostRecentDiscussion } from 'components/MentionTextArea/util';
import Spinner from 'components/Spinner';
import { UseDiscussionParamsReturn } from 'hooks/useDiscussionParams';

type RecentDiscussionProps = {
  loading: boolean;
  grbReviewStartedAt: string | null | undefined;
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
  pushDiscussionQuery: UseDiscussionParamsReturn['pushDiscussionQuery'];
};

/**
 * If GRB review has been started, show discussion with latest activity
 */
const RecentDiscussion = ({
  loading,
  grbReviewStartedAt,
  grbDiscussions,
  pushDiscussionQuery
}: RecentDiscussionProps) => {
  const { t } = useTranslation('discussions');

  if (!grbReviewStartedAt) {
    return (
      <Alert type="info" slim>
        {t('general.alerts.reviewNotStarted')}
      </Alert>
    );
  }

  /** Discussion with latest activity - either when discussion was created or latest reply */
  const recentDiscussion = getMostRecentDiscussion(grbDiscussions);

  if (!recentDiscussion) {
    return (
      <Alert type="info" slim>
        <Trans
          i18nKey="discussions:general.alerts.noDiscussionsStartButton"
          components={{
            button: (
              <Button
                type="button"
                onClick={() => {
                  pushDiscussionQuery({ discussionMode: 'start' });
                }}
                unstyled
              >
                text
              </Button>
            )
          }}
        />
      </Alert>
    );
  }

  return (
    <>
      <h4 className="margin-bottom-2">{t('general.mostRecentActivity')}</h4>

      {loading ? (
        <Spinner />
      ) : (
        <DiscussionPost
          {...recentDiscussion.initialPost}
          replies={recentDiscussion.replies}
          truncateText
        />
      )}
    </>
  );
};

export default RecentDiscussion;
