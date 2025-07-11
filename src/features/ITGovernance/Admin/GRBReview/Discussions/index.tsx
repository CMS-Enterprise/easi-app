import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import DiscussionBoard from 'features/DiscussionBoard';
import {
  SystemIntakeGRBDiscussionBoardType,
  SystemIntakeStatusAdmin,
  useGetSystemIntakeGRBDiscussionsQuery
} from 'gql/generated/graphql';

import CollapsableLink from 'components/CollapsableLink';

import DiscussionBoardCard from './_components/DiscussionBoardCard';

type DiscussionsProps = {
  systemIntakeID: string;
  statusAdmin: SystemIntakeStatusAdmin;
  className?: string;
};

/** Displays discussion boards on GRB review tab */
const Discussions = ({
  systemIntakeID,
  statusAdmin,
  className
}: DiscussionsProps) => {
  const { t } = useTranslation('discussions');

  const { data, loading } = useGetSystemIntakeGRBDiscussionsQuery({
    variables: { id: systemIntakeID }
  });

  const { grbDiscussionsInternal, grbDiscussionsPrimary } =
    data?.systemIntake || {};

  /** Returns true if the request is not in the GRB step */
  const readOnly = ![
    SystemIntakeStatusAdmin.GRB_MEETING_READY,
    SystemIntakeStatusAdmin.GRB_REVIEW_IN_PROGRESS,
    SystemIntakeStatusAdmin.GRB_MEETING_COMPLETE
  ].includes(statusAdmin);

  if (!grbDiscussionsInternal || !grbDiscussionsPrimary) return null;

  return (
    <>
      <DiscussionBoard systemIntakeID={systemIntakeID} readOnly={readOnly} />

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
            {(
              t('general.usageTips.content', {
                returnObjects: true
              }) as string[]
            ).map((item, index) => (
              <li key={item} className="line-height-body-5 margin-bottom-05">
                <Trans
                  i18nKey={`discussions:general.usageTips.content.${index}`}
                  components={{ span: <span className="text-primary" /> }}
                />
              </li>
            ))}
          </ul>
        </CollapsableLink>

        <DiscussionBoardCard
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.PRIMARY}
          grbDiscussions={grbDiscussionsPrimary}
          loading={loading}
          readOnly={readOnly}
        />

        <DiscussionBoardCard
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.INTERNAL}
          grbDiscussions={grbDiscussionsInternal}
          loading={loading}
          readOnly={readOnly}
        />
      </div>
    </>
  );
};

export default Discussions;
