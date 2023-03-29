import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as USWDSLink, SummaryBox } from '@trussworks/react-uswds';

export default ({
  className,
  content,
  email
}: {
  className?: string;
  content?: string;
  email?: string;
}) => {
  const { t } = useTranslation('help');
  const em = email || t('needHelp.email');
  const con = content || t('needHelp.content');

  return (
    <SummaryBox heading={t('needHelp.heading')} className={className}>
      <div className="margin-top-2 margin-bottom-05">{con}</div>
      <div>
        <USWDSLink href={`mailto:${em}`}>{em}</USWDSLink>
      </div>
    </SummaryBox>
  );
};
