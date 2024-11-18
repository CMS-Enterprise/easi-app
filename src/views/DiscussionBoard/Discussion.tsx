import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

type DiscussionProps = {
  systemIntakeId: string;
  discussion: SystemIntakeGRBReviewDiscussionFragment;
};

/**
 * Single discussion post view
 *
 * Displays discussion, replies, and form to reply to discussion post
 */
const Discussion = ({ systemIntakeId, discussion }: DiscussionProps) => {
  const { t } = useTranslation('discussions');

  return (
    <div>
      <h1 className="margin-bottom-105">
        {t('general.viewDiscussion.heading')}
      </h1>
    </div>
  );
};

export default Discussion;
