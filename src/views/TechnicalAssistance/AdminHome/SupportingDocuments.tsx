import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import { TrbAdminPageProps } from 'types/technicalAssistance';

import DocumentsTable from '../RequestForm/DocumentsTable';

import NoteBox from './components/NoteBox';

const SupportingDocuments = ({
  trbRequestId,
  noteCount
}: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <Grid row gap="lg" data-testid="trb-admin-home__documents">
      <Grid tablet={{ col: 8 }}>
        <h1 className="margin-y-0">
          {t('adminHome.supportingDocuments.title')}
        </h1>

        <p className="line-height-body-5 margin-y-0">
          {t('documents.supportingDocuments.adminInfo')}
        </p>
      </Grid>
      <Grid tablet={{ col: 4 }}>
        <NoteBox trbRequestId={trbRequestId} noteCount={noteCount} />
      </Grid>

      <Grid desktop={{ col: 12 }} className="margin-top-2">
        <DocumentsTable trbRequestId={trbRequestId} canEdit={false} />
      </Grid>
    </Grid>
  );
};

export default SupportingDocuments;
