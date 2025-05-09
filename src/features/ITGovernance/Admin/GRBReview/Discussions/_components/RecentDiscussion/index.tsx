import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import DiscussionPost from 'features/DiscussionBoard/_components/DiscussionPost';
import {
  SystemIntakeGRBDiscussionBoardType,
  SystemIntakeGRBReviewDiscussionFragment
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Spinner from 'components/Spinner';
import { UseDiscussionParamsReturn } from 'hooks/useDiscussionParams';

import { getMostRecentDiscussion } from '../../util';

type RecentDiscussionProps = {
  loading: boolean;
  discussionBoardType: SystemIntakeGRBDiscussionBoardType;
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
  pushDiscussionQuery: UseDiscussionParamsReturn['pushDiscussionQuery'];
  readOnly?: boolean;
};

/**
 * If GRB review has been started, show discussion with latest activity
 */
const RecentDiscussion = ({
  loading,
  discussionBoardType,
  grbDiscussions,
  pushDiscussionQuery,
  readOnly
}: RecentDiscussionProps) => {
  const { t } = useTranslation('discussions');

  /** Discussion with latest activity - either when discussion was created or latest reply */
  const recentDiscussion = getMostRecentDiscussion(grbDiscussions);

  if (!recentDiscussion) {
    return (
      <Alert type="info" slim>
        {readOnly ? (
          t('general.alerts.noDiscussions')
        ) : (
          <Trans
            i18nKey="discussions:general.alerts.noDiscussionsStartButton"
            components={{
              button: (
                <Button
                  type="button"
                  onClick={() => {
                    pushDiscussionQuery({
                      discussionBoardType,
                      discussionMode: 'start'
                    });
                  }}
                  unstyled
                >
                  text
                </Button>
              )
            }}
          />
        )}
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
          readOnly={readOnly}
          replies={recentDiscussion.replies}
          discussionBoardType={discussionBoardType}
          truncateText
        />
      )}
    </>
  );
};

export default RecentDiscussion;
