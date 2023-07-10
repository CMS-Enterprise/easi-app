import React from 'react';
import { useTranslation } from 'react-i18next';

const NextStep = () => {
  const { t } = useTranslation('action');

  return (
    <>
      <h1>{t('nextStep.title')}</h1>
    </>
  );
};

export default NextStep;
