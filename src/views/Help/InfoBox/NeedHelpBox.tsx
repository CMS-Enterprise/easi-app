import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as USWDSLink } from '@trussworks/react-uswds';

import InfoBox from '.';

export default () => {
  const { t } = useTranslation('help');
  return (
    <InfoBox heading={t('needHelp')}>
      <div className="margin-bottom-05">{t('contactGovernanceTeam')}</div>
      <div>
        <USWDSLink href="mailto:IT_Governance@cms.hhs.gov">
          IT_Governance@cms.hhs.gov
        </USWDSLink>
      </div>
    </InfoBox>
  );
};
