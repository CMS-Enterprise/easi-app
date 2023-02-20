import React from 'react';
import { useTranslation } from 'react-i18next';

import { TrbAdminPageProps } from 'types/technicalAssistance';

const Notes = ({ trbRequestId }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div
      className="trb-admin-home__notes"
      data-testid="trb-admin-home__notes"
      id={`trbAdminNotes-${trbRequestId}`}
    >
      <h1 className="margin-y-0">{t('adminHome.subnav.notes')}</h1>
    </div>
  );
};

export default Notes;
