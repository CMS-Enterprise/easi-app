import React from 'react';
import { useTranslation } from 'react-i18next';

const Resolutions = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  return <div>{t('resolutions.title')}</div>;
};

export default Resolutions;
