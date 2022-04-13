import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as USWDSLink, SummaryBox } from '@trussworks/react-uswds';

export default ({ className }: { className?: string }) => {
  const { t } = useTranslation('help');
  return (
    <SummaryBox heading={t('needHelp.heading')} className={className}>
      <div className="margin-top-2 margin-bottom-05">
        {t('needHelp.content')}
      </div>
      <div>
        <USWDSLink href={`mailto:${t('needHelp.email')}`}>
          {t('needHelp.email')}
        </USWDSLink>
      </div>
    </SummaryBox>
  );
};
