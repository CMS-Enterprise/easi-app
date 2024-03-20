/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconLightbulbOutline, SummaryBox } from '@trussworks/react-uswds';
import classNames from 'classnames';

export const HelpLinks = ({ classname }: { classname?: string }) => {
  const { t } = useTranslation('systemWorkspace');

  return (
    <SummaryBox
      heading=""
      className={classNames(
        'border-0 radius-0 bg-accent-cool-lighter',
        classname
      )}
    >
      <div className="margin-top-neg-1">
        <div className="display-flex flex-align-center flex-justify">
          <h3 className="margin-y-0">{t('helpLinks.header')}</h3>
          <IconLightbulbOutline size={4} className="text-primary" />
        </div>

        <p className="margin-top-1">{t('helpLinks.description')}</p>
      </div>
    </SummaryBox>
  );
};

export default HelpLinks;
