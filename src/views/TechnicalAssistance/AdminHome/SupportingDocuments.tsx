import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';

import DocumentsTable from '../RequestForm/DocumentsTable';

import TrbAdminWrapper from './components/TrbAdminWrapper';

const SupportingDocuments = ({
  trbRequest,
  assignLeadModalRef,
  assignLeadModalTrbRequestIdRef
}: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <TrbAdminWrapper
      activePage="documents"
      trbRequestId={trbRequest.id}
      title={t('adminHome.supportingDocuments')}
      description={t('documents.supportingDocuments.adminInfo')}
      noteCount={trbRequest.adminNotes.length}
      disableStep={
        trbRequest.status !== TRBRequestStatus.CONSULT_SCHEDULED &&
        trbRequest.status !== TRBRequestStatus.GUIDANCE_LETTER_SENT &&
        trbRequest.state !== TRBRequestState.CLOSED
      }
      adminActionProps={{
        status: trbRequest.status,
        state: trbRequest.state,
        assignLeadModalTrbRequestIdRef,
        assignLeadModalRef
      }}
    >
      <Grid desktop={{ col: 12 }} className="margin-top-2">
        <DocumentsTable trbRequestId={trbRequest.id} canEdit={false} />
      </Grid>
    </TrbAdminWrapper>
  );
};

export default SupportingDocuments;
