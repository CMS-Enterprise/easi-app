import React from 'react';
import { useTranslation } from 'react-i18next';

import { TrbAdminPageProps } from 'types/technicalAssistance';

const InitialRequestForm = ({ trbRequest }: TrbAdminPageProps) => {
  const { id } = trbRequest;
  const { t } = useTranslation('technicalAssistance');
  return (
    <div
      className="trb-admin-home__initial-request-form"
      data-testid="trb-admin-home__initial-request-form"
      id={`trbAdminInitialRequestForm-${id}`}
    >
      <h1 className="margin-y-0">{t('adminHome.subnav.initialRequestForm')}</h1>
    </div>
  );
};

export default InitialRequestForm;
