import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link as USWDSLink,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

const NeedHelpBox = ({
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
    <SummaryBox className={className}>
      <SummaryBoxHeading headingLevel="h3">
        {t('needHelp.heading')}
      </SummaryBoxHeading>
      <SummaryBoxContent>
        <div className="margin-top-2 margin-bottom-05">
          {con} <USWDSLink href={`mailto:${em}`}>{em}</USWDSLink>
        </div>
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default NeedHelpBox;
