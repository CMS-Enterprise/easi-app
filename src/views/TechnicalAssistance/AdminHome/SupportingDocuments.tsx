import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import { TrbAdminPageProps } from 'types/technicalAssistance';

import DocumentsTable from '../RequestForm/DocumentsTable';

import RequestNotes from './components/RequestNotes';

const SupportingDocuments = ({ trbRequestId }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <Grid row gap="lg">
      <Grid tablet={{ col: 8 }}>
        <h1 className="margin-y-0">
          {t('adminHome.subnav.supportingDocuments')}
        </h1>

        <p className="line-height-body-5 margin-y-0">
          {t('documents.adminInfo')}
        </p>
      </Grid>
      <Grid tablet={{ col: 4 }}>
        <RequestNotes trbRequestId={trbRequestId} />
      </Grid>

      <Grid desktop={{ col: 12 }} className="margin-top-2">
        <DocumentsTable trbRequestId={trbRequestId} canEdit={false} />
      </Grid>
    </Grid>
  );
};

export default SupportingDocuments;
