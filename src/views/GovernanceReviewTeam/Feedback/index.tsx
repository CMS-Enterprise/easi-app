import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeading from 'components/PageHeading';
import FeedbackList from 'views/GovernanceTaskList/Feedback/FeedbackList';

type FeedbackProps = {
  systemIntakeId: string;
};

const Feedback = ({ systemIntakeId }: FeedbackProps) => {
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <div className="padding-bottom-6">
      <PageHeading className="margin-y-0">{t('feedback.title')}</PageHeading>
      <p className="font-body-md line-height-body-4 text-light margin-top-05">
        {t('feedback.description')}
      </p>

      <FeedbackList systemIntakeId={systemIntakeId} />
    </div>
  );
};

export default Feedback;
