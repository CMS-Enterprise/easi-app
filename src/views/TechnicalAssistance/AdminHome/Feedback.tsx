import React from 'react';
import { useTranslation } from 'react-i18next';

import { TrbAdminPage } from 'types/technicalAssistance';

const Feedback: TrbAdminPage = trbRequestId => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div
      className="trb-admin-home__feedback"
      data-testid="trb-admin-home__feedback"
      id={`trbAdminFeedback-${trbRequestId}`}
    >
      <h1 className="margin-y-0">{t('adminHome.subnav.feedback')}</h1>
    </div>
  );
};

export default Feedback;
