import React from 'react';
import { useTranslation } from 'react-i18next';

import { TrbAdminPage } from 'types/technicalAssistance';

const AdviceLetter: TrbAdminPage = trbRequestId => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div
      className="trb-admin-home__advice"
      data-testid="trb-admin-home__advice"
      id={`trbAdminAdviceLetter-${trbRequestId}`}
    >
      <h1 className="margin-y-0">{t('adminHome.subnav.adviceLetter')}</h1>
    </div>
  );
};

export default AdviceLetter;
