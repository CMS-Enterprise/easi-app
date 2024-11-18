import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

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

  return (
    <div>
      <h1 className="margin-bottom-105">
        {t('governanceReviewBoard.internal.label')}
      </h1>
      <p className="font-body-lg text-light line-height-body-5 margin-top-105">
        {t('governanceReviewBoard.internal.description')}
      </p>
    </div>
  );
};

export default ViewDiscussions;
