import React from 'react';
import { useTranslation } from 'react-i18next';

import DiscussionForm from './components/DiscussionForm';

type StartDiscussionProps = {
  systemIntakeID: string;
  closeModal: () => void;
};

/**
 * Form to start new discussion post
 */
const StartDiscussion = ({
  systemIntakeID,
  closeModal
}: StartDiscussionProps) => {
  const { t } = useTranslation('discussions');

  return (
    <div>
      <h1 className="margin-bottom-205">
        {t('general.startDiscussion.heading')}
      </h1>
      <p className="line-height-body-5 margin-bottom-5">
        {t('general.startDiscussion.description')}
      </p>

      <DiscussionForm
        closeModal={closeModal}
        type="discussion"
        systemIntakeID={systemIntakeID}
      />
    </div>
  );
};

export default StartDiscussion;
