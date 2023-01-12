import React from 'react';
import { useTranslation } from 'react-i18next';

import { TrbAdminPage } from 'types/technicalAssistance';

const Documents: TrbAdminPage = trbRequestId => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div
      className="trb-admin-home__documents"
      data-testid="trb-admin-home__documents"
      id={`trbAdminDocuments-${trbRequestId}`}
    >
      <h1 className="margin-y-0">
        {t('adminHome.subnav.supportingDocuments')}
      </h1>
    </div>
  );
};

export default Documents;
