import React from 'react';
import { useTranslation } from 'react-i18next';

import SystemIntakeReview from 'components/SystemIntakeReview';
import { SystemIntakeForm } from 'types/systemIntake';

type IntakeReviewProps = {
  systemIntake: SystemIntakeForm;
};

const IntakeReview = ({ systemIntake }: IntakeReviewProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="margin-top-0">{t('general:intake')}</h1>
      <SystemIntakeReview systemIntake={systemIntake} />
    </div>
  );
};

export default IntakeReview;
