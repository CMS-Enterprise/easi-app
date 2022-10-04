import React from 'react';
import { useTranslation } from 'react-i18next';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Check({ request, stepUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  return (
    <Pager
      back={{ url: stepUrl.back }}
      next={{
        url: stepUrl.next,
        text: t('check.submit')
      }}
    />
  );
}

export default Check;
