import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconLightbulbOutline, SummaryBox } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { HelpLinkType } from 'i18n/en-US/systemWorkspace';

import HelpCardGroup from './SystemCardGroup';

export const HelpLinks = ({ classname }: { classname?: string }) => {
  const { t } = useTranslation('systemWorkspace');

  const helpCards = t<HelpLinkType[]>('helpLinks.links', {
    returnObjects: true
  });

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

      <HelpCardGroup cards={helpCards} />
    </SummaryBox>
  );
};

export default HelpLinks;
