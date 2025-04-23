import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import DiscussionBoard from 'features/DiscussionBoard';
import {
  SystemIntakeGRBDiscussionBoardType,
  SystemIntakeGRBReviewerFragment,
  useGetSystemIntakeGRBDiscussionsQuery
} from 'gql/generated/graphql';

import CollapsableLink from 'components/CollapsableLink';

import DiscussionBoardSummary from './_components/DiscussionBoardSummary';

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

  const { data, loading } = useGetSystemIntakeGRBDiscussionsQuery({
    variables: { id: systemIntakeID }
  });

  const { grbDiscussionsInternal, grbDiscussionsPrimary } =
    data?.systemIntake || {};

  if (!grbDiscussionsInternal || !grbDiscussionsPrimary) return null;

  return (
    <>
      <DiscussionBoard
        systemIntakeID={systemIntakeID}
        grbReviewers={grbReviewers}
        grbDiscussions={grbDiscussionsInternal}
        grbReviewStartedAt={grbReviewStartedAt}
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

        <DiscussionBoardSummary
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.PRIMARY}
          grbDiscussions={grbDiscussionsPrimary}
          grbReviewStartedAt={grbReviewStartedAt}
          loading={loading}
        />

        <DiscussionBoardSummary
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.INTERNAL}
          grbDiscussions={grbDiscussionsInternal}
          grbReviewStartedAt={grbReviewStartedAt}
          loading={loading}
        />
      </div>
    </>
  );
};

export default Discussions;
