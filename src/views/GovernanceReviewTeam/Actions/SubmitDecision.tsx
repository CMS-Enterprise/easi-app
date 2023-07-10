import React from 'react';
import { useTranslation } from 'react-i18next';

const SubmitDecision = () => {
  const { t } = useTranslation('action');

  return (
    <>
      <h1>{t('decision.title')}</h1>
    </>
  );
};

export default SubmitDecision;
