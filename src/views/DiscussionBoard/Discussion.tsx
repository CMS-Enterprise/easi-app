import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import DiscussionForm from './DiscussionForm.tsx';

type DiscussionProps = {
  systemIntakeId: string;
  discussion: SystemIntakeGRBReviewDiscussionFragment;
  closeModal: () => void;
};

/**
 * Single discussion post view
 *
 * Displays discussion, replies, and form to reply to discussion post
 */
const Discussion = ({
  systemIntakeId,
  discussion,
  closeModal
}: DiscussionProps) => {
  const { t } = useTranslation('discussions');

  return (
    <div>
      <h1 className="margin-bottom-105">{t('general.discussion')}</h1>

      <h2 className="margin-bottom-2">{t('general.reply')}</h2>
      <DiscussionForm type="reply" closeModal={closeModal} />
    </div>
  );
};

export default Discussion;
