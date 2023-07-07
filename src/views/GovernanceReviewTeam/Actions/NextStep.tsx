import React from 'react';
import { useTranslation } from 'react-i18next';

const NextStep = () => {
  const { t } = useTranslation('action');

  return (
    <div>
      <h1>{t('nextStep.title')}</h1>
    </div>
  );
};

export default NextStep;
