import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import IconButton from 'components/shared/IconButton';
import DiscussionBoard from 'views/DiscussionBoard';
import DiscussionPost from 'views/DiscussionBoard/components/DiscussionPost';

type DiscussionsProps = {
  systemIntakeID: string;
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
  className?: string;
};

/** Displays recent discussions on GRB Review tab */
const Discussions = ({
  systemIntakeID,
  grbDiscussions,
  className
}: DiscussionsProps) => {
  const { t } = useTranslation('discussions');

  const discussionsWithoutRepliesCount = grbDiscussions.filter(
    discussion => discussion.replies.length === 0
  ).length;

  const recentDiscussion =
    grbDiscussions.length > 0 ? grbDiscussions[0] : undefined;

  const history = useHistory();
  const location = useLocation();

  return (
    <>
      <DiscussionBoard
        systemIntakeID={systemIntakeID}
        grbDiscussions={grbDiscussions}
      />

      <div
        id="discussions"
        className={classNames(
          'grb-discussions bg-base-lightest padding-x-3 padding-y-3 radius-md',
          className
        )}
      >
        <h2 className="margin-top-0 margin-bottom-1">{t('general.label')}</h2>
        <p className="margin-top-0 line-height-body-5">
          {t('governanceReviewBoard.discussionsDescription')}
        </p>

        <CollapsableLink
          id="discussionBoardTips"
          label={t('general.usageTips.label')}
          className="text-bold"
        >
          <ul className="margin-y-0 padding-left-205">
            {t<string[]>('general.usageTips.content', {
              returnObjects: true
            }).map((item, index) => (
              <li key={item} className="line-height-body-5 margin-bottom-05">
                <Trans
                  i18nKey={`discussions:general.usageTips.content.${index}`}
                  components={{ span: <span className="text-primary" /> }}
                />
              </li>
            ))}
          </ul>
        </CollapsableLink>

        <div className="internal-discussion-board bg-white padding-3 padding-bottom-4 margin-top-4 border-base-lighter shadow-2">
          <div className="internal-discussions-board__header desktop:display-flex flex-align-start">
            <h3 className="margin-top-0 margin-bottom-1">
              {t('governanceReviewBoard.internal.label')}
            </h3>
            <p className="margin-0 margin-top-05 text-base display-flex text-no-wrap">
              <Icon.LockOutline className="margin-right-05" />
              <span>
                {t('governanceReviewBoard.internal.visibilityRestricted')}
              </span>
            </p>
            <Button
              type="button"
              onClick={() => {
                history.push(`${location.pathname}?discussion=view`);
              }}
              className="margin-right-0 margin-y-2 desktop:margin-y-0 text-no-wrap"
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
                  history.push(`${location.pathname}?discussion=view`);
                }}
                icon={<Icon.ArrowForward />}
                iconPosition="after"
                unstyled
              >
                {t('general.view')}
              </IconButton>
            )}
          </div>

          {/* Recent discussions */}
          {recentDiscussion ? (
            <>
              <h4 className="margin-bottom-2">
                {t('general.mostRecentActivity')}
              </h4>
              <DiscussionPost
                {...recentDiscussion.initialPost}
                replies={recentDiscussion.replies}
              />
            </>
          ) : (
            // If no discussions, show alert
            <Alert type="info" slim>
              <Trans
                i18nKey="discussions:general.alerts.noDiscussionsStartButton"
                components={{
                  button: (
                    <Button
                      type="button"
                      onClick={() => {
                        history.push(`${location.pathname}?discussion=view`);
                      }}
                      unstyled
                    >
                      text
                    </Button>
                  )
                }}
              />
            </Alert>
          )}
        </div>
      </div>
    </>
  );
};

export default Discussions;