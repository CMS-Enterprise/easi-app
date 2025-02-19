import React from 'react';
import { useTranslation } from 'react-i18next';

import Alert from 'components/Alert';

import './index.scss';

const MandatoryFieldsAlert = ({ className }: { className?: string }) => {
  const { t } = useTranslation('form');
  return (
    <Alert
      type="info"
      className={className}
      data-testid="mandatory-fields-alert"
      slim
    >
      {t('allFieldsMandatory')}
    </Alert>
  );
};

export default MandatoryFieldsAlert;
