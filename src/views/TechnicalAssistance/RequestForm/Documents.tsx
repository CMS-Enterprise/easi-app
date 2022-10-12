import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Documents({ request, stepUrl }: FormStepComponentProps) {
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
        onClick: e => {
          history.push(stepUrl.next);
        },
        text: t('documents.continueWithoutAdding'),
        outline: true
      }}
    />
  );
}

export default Documents;
