import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';

const RequestEdits = () => {
  const { t } = useTranslation('action');

  return (
    <GridContainer className="margin-bottom-10">
      <PageHeading className="margin-bottom-0">
        {t('requestEdits.title')}
      </PageHeading>
      <p className="line-height-body-5 font-body-lg text-light margin-0">
        {t('requestEdits.description')}
      </p>

      <p className="margin-top-1 text-base">
        <Trans
          i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
          components={{ red: <span className="text-red" /> }}
        />
      </p>

      {/* Form fields */}
      <Grid col={6}>
        {/* Notification email */}
        <h3 className="margin-top-6 margin-bottom-0">
          {t('notification.heading')}
        </h3>
        <Alert type="info" slim>
          {t('notification.alert')}
        </Alert>
        <Trans
          i18nKey="action:notification.description"
          components={{ p: <p className="line-height-body-5" /> }}
        />
      </Grid>
    </GridContainer>
  );
};

export default RequestEdits;
