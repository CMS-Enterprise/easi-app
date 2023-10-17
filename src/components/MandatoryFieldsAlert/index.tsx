import React from 'react';
import { useTranslation } from 'react-i18next';

import Alert from 'components/shared/Alert';

import './index.scss';

const MandatoryFieldsAlert = () => {
  const { t } = useTranslation('form');
  return (
    <Alert type="info" slim data-testid="mandatory-fields-alert">
      {t('allFieldsMandatory')}
    </Alert>
  );
};

export default MandatoryFieldsAlert;
