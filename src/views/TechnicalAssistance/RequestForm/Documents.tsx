import React from 'react';
import { useTranslation } from 'react-i18next';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Documents({ request, stepUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  return (
    <Pager
      back={{ url: stepUrl.back }}
      next={{
        url: stepUrl.next,
        text: t('documents.continueWithoutAdding'),
        style: 'outline'
      }}
    />
  );
}

export default Documents;
