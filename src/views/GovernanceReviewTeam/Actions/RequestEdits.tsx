import React from 'react';
import { useTranslation } from 'react-i18next';

const RequestEdits = () => {
  const { t } = useTranslation('action');

  return (
    <>
      <h1>{t('requestEdits.title')}</h1>
    </>
  );
};

export default RequestEdits;
