import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import DiscussionReply from 'components/DiscussionReply';

type DiscussionsCardProps = {
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
};

/** Displays recent discussions on GRB Review tab */
const DiscussionsCard = ({ grbDiscussions }: DiscussionsCardProps) => {
  const { t } = useTranslation('discussions');

  return (
    <div>
      <h2>{t('general.label')}</h2>
      <DiscussionReply discussion={grbDiscussions[0]} />
    </div>
  );
};

export default DiscussionsCard;
