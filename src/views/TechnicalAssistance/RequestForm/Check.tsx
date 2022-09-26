import React from 'react';
import { useTranslation } from 'react-i18next';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Check({ request, step }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  return (
    <Pager
      back={{ url: `/trb/requests/${request.id}/${step - 1}` }}
      next={{
        url: `/trb/requests/${request.id}/done`,
        text: t('check.submit')
      }}
    />
  );
}

export default Check;
