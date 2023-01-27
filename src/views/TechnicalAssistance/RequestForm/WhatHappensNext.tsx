import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryBox } from '@trussworks/react-uswds';

const WhatHappensNext = () => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <SummaryBox heading={t('check.whatNext.title')}>
      <div>{t('check.whatNext.text.0')}</div>
      <ul className="usa-list margin-y-05">
        <li>{t('check.whatNext.list.0')}</li>
        <li>{t('check.whatNext.list.1')}</li>
        <li>{t('check.whatNext.list.2')}</li>
      </ul>
      <div>{t('check.whatNext.text.1')}</div>
    </SummaryBox>
  );
};

export default WhatHappensNext;
