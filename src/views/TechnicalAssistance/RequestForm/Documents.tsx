import React from 'react';
import { useTranslation } from 'react-i18next';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Documents({ request, step }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  return (
    <Pager
      back={{ url: `/trb/requests/${request.id}/${step - 1}` }}
      next={{
        url: `/trb/requests/${request.id}/${step + 1}`,
        text: t('documents.continueWithoutAdding'),
        style: 'outline'
      }}
    />
  );
}

export default Documents;
