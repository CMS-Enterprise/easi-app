import React from 'react';
import { useTranslation } from 'react-i18next';

import { TrbAdminPage } from 'types/technicalAssistance';

const InitialRequestForm: TrbAdminPage = trbRequestId => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div
      className="trb-admin-home__initial-request-form"
      data-testid="trb-admin-home__initial-request-form"
      id={`trbAdminInitialRequestForm-${trbRequestId}`}
    >
      <h1 className="margin-y-0">{t('adminHome.subnav.initialRequestForm')}</h1>
    </div>
  );
};

export default InitialRequestForm;
