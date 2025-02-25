import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

const WhatHappensNext = () => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <SummaryBox>
      <SummaryBoxHeading headingLevel="h3">
        {t('check.whatNext.title')}
      </SummaryBoxHeading>
      <SummaryBoxContent>
        <div>{t('check.whatNext.text.0')}</div>
        <ul className="usa-list margin-y-05">
          <li>{t('check.whatNext.list.0')}</li>
          <li>{t('check.whatNext.list.1')}</li>
          <li>{t('check.whatNext.list.2')}</li>
        </ul>
        <div>{t('check.whatNext.text.1')}</div>
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default WhatHappensNext;
