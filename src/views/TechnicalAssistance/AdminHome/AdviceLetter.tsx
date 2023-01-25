import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import { TrbAdminPageProps } from 'types/technicalAssistance';

import AdminAction from './components/AdminAction';
import RequestNotes from './components/RequestNotes';

const AdviceLetter = ({ trbRequestId }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div
      className="trb-admin-home__advice"
      data-testid="trb-admin-home__advice"
      id={`trbAdminAdviceLetter-${trbRequestId}`}
    >
      <Grid row gap="lg">
        <Grid tablet={{ col: 8 }}>
          <h1 className="margin-top-0 margin-bottom-05">
            {t('adminHome.subnav.adviceLetter')}
          </h1>
          <p className="margin-y-0 line-height-body-5 font-body-md">
            {t('adviceLetter.introText')}
          </p>
        </Grid>
        <Grid tablet={{ col: 4 }}>
          <RequestNotes trbRequestId={trbRequestId} />
        </Grid>
      </Grid>
      <AdminAction />
    </div>
  );
};

export default AdviceLetter;
