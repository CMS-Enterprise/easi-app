import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, SummaryBox, SummaryBoxContent } from '@trussworks/react-uswds';
import classNames from 'classnames';

import CollapsableLink from 'components/CollapsableLink';
import { HelpLinkType } from 'i18n/en-US/systemWorkspace';

import HelpCardGroup from './SystemCardGroup';

export const HelpLinks = ({
  classname,
  linkSearchQuery
}: {
  classname?: string;
  linkSearchQuery: string | undefined;
}) => {
  const { t } = useTranslation('systemWorkspace');

  const helpCards = t('helpLinks.links', {
    returnObjects: true
  }) as HelpLinkType[];

  return (
    <SummaryBox
      className={classNames(
        'border-0 radius-0 bg-accent-cool-lighter',
        classname
      )}
    >
      <SummaryBoxContent>
        <div className="margin-top-neg-1">
          <div className="display-flex flex-align-center flex-justify">
            <h3 className="margin-y-0">{t('helpLinks.header')}</h3>

            <Icon.LightbulbOutline
              size={4}
              className="text-primary"
              aria-hidden
            />
          </div>

          <p className="margin-top-1">{t('helpLinks.description')}</p>
        </div>

        <CollapsableLink
          id="system-help-link-toggle"
          label={t('helpLinks.showLinks')}
          closeLabel={t('helpLinks.hideLinks')}
          styleLeftBar={false}
          labelPosition="bottom"
          eyeIcon
          bold={false}
          className="text-normal margin-bottom-1"
        >
          <HelpCardGroup cards={helpCards} linkSearchQuery={linkSearchQuery} />
        </CollapsableLink>
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default HelpLinks;
