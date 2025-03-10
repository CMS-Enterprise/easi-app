import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import DiscussionBoard from 'features/DiscussionBoard';
import {
  SystemIntakeGRBReviewDiscussionFragment,
  SystemIntakeGRBReviewerFragment,
  useGetSystemIntakeGRBDiscussionsQuery
} from 'gql/generated/graphql';

import CollapsableLink from 'components/CollapsableLink';
import IconButton from 'components/IconButton';
import useDiscussionParams from 'hooks/useDiscussionParams';

import RecentDiscussion from './_components/RecentDiscussion';

type DiscussionsProps = {
  systemIntakeID: string;
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  grbReviewStartedAt?: string | null;
  className?: string;
};

/** Displays recent discussions on GRB Review tab */
const Discussions = ({
  systemIntakeID,
  grbReviewers,
  grbReviewStartedAt,
  className
}: DiscussionsProps) => {
  const { t } = useTranslation('discussions');

  const { pushDiscussionQuery } = useDiscussionParams();

  const { data, loading } = useGetSystemIntakeGRBDiscussionsQuery({
    variables: { id: systemIntakeID }
  });

  const grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[] | undefined =
    data?.systemIntake?.grbDiscussions;

  if (!grbDiscussions) return null;

  const discussionsWithoutRepliesCount = grbDiscussions.filter(
    discussion => discussion.replies.length === 0
  ).length;

  return (
    <>
      <DiscussionBoard
        systemIntakeID={systemIntakeID}
        grbReviewers={grbReviewers}
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
                pushDiscussionQuery({ discussionMode: 'view' });
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
                  pushDiscussionQuery({ discussionMode: 'view' });
                }}
                icon={<Icon.ArrowForward />}
                iconPosition="after"
                unstyled
              >
                {t('general.view')}
              </IconButton>
            )}
          </div>

          <RecentDiscussion
            loading={loading}
            grbReviewStartedAt={grbReviewStartedAt}
            grbDiscussions={grbDiscussions}
            pushDiscussionQuery={pushDiscussionQuery}
          />
        </div>
      </div>
    </>
  );
};

export default Discussions;
