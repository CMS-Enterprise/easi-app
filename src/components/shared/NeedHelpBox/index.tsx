import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as USWDSLink } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

type NeedHelpBoxProps = {
  id?: string;
  className?: string;
};

export default ({ id, className }: NeedHelpBoxProps) => {
  const { t } = useTranslation('help');
  return (
    <div
      id={id}
      className={classnames(
        'need-help-box bg-accent-cool-lighter border border-accent-cool-light radius-md padding-3',
        className
      )}
    >
      <div className="font-sans-lg line-height-body-1 text-bold margin-bottom-2">
        {t('needHelp')}
      </div>
      <div className="line-height-body-5">
        <div className="margin-bottom-05">{t('contactGovernanceTeam')}</div>
        <div>
          <USWDSLink href="mailto:IT_Governance@cms.hhs.gov">
            IT_Governance@cms.hhs.gov
          </USWDSLink>
        </div>
      </div>
    </div>
  );
};
