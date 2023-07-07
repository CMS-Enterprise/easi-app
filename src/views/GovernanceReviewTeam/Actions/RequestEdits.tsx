import React from 'react';
import { useTranslation } from 'react-i18next';

const RequestEdits = () => {
  const { t } = useTranslation('action');

  return (
    <div>
      <h1>{t('requestEdits.title')}</h1>
    </div>
  );
};

export default RequestEdits;
