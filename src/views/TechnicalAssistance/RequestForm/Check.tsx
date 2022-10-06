import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Check({ request, stepUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();
  return (
    <Pager
      back={{
        onClick: () => {
          history.push(stepUrl.back);
        }
      }}
      next={{
        onClick: () => {
          history.push(stepUrl.next);
        },
        text: t('check.submit')
      }}
    />
  );
}

export default Check;
