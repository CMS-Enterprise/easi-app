import React from 'react';
import { useTranslation } from 'react-i18next';

import { TrbAdminPageProps } from 'types/technicalAssistance';

const RequestHome = ({ trbRequestId }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div
      className="trb-admin-home__request-home"
      data-testid="trb-admin-home__request-home"
      id={`trbAdminRequestHome-${trbRequestId}`}
    >
      <h1 className="margin-y-0">{t('adminHome.subnav.requestHome')}</h1>
    </div>
  );
};

export default RequestHome;
