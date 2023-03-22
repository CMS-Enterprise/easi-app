import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Grid,
  GridContainer,
  IconArrowBack
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import useMessage from 'hooks/useMessage';

import Breadcrumbs from '../Breadcrumbs';

import DocumentsTable from './DocumentsTable';

export type DocumentStatusType = 'success' | 'error';

const DocumentsTaskList = () => {
  const { t } = useTranslation('technicalAssistance');

  const { message } = useMessage();

  const { id: requestID } = useParams<{
    id: string;
  }>();

  const [documentMessage, setDocumentMessage] = useState('');
  const [documentStatus, setDocumentStatus] = useState<DocumentStatusType>(
    'error'
  );

  return (
    <GridContainer>
      <Grid desktop={{ col: 12 }}>
        <Breadcrumbs
          items={[
            { text: t('heading'), url: '/trb' },
            {
              text: t('taskList.heading'),
              url: `/trb/task-list/${requestID}`
            },
            {
              text: t('documents.supportingDocuments.heading')
            }
          ]}
        />

        {message && message}

        {documentMessage && (
          <Alert type={documentStatus} slim className="margin-y-4">
            {documentMessage}
          </Alert>
        )}

        <h1 className="margin-bottom-0 margin-top-6">
          {t('adminHome.subnav.supportingDocuments')}
        </h1>

        <p className="line-height-body-5 margin-top-0 margin-bottom-2">
          {t('documents.supportingDocuments.info')}
        </p>

        <UswdsReactLink to={`/trb/task-list/${requestID}`}>
          <IconArrowBack className="margin-right-1 text-middle" />
          <span className="line-height-body-5">
            {t('requestFeedback.returnToTaskList')}
          </span>
        </UswdsReactLink>

        <div className="display-block margin-top-5 margin-bottom-4">
          <UswdsReactLink
            className="usa-button usa-button--outline"
            variant="unstyled"
            to={`/trb/task-list/${requestID}/documents/upload`}
          >
            {t('documents.supportingDocuments.addAnother')}
          </UswdsReactLink>
        </div>

        <DocumentsTable
          trbRequestId={requestID}
          setDocumentMessage={setDocumentMessage}
          setDocumentStatus={setDocumentStatus}
        />

        <div className="margin-top-5">
          <UswdsReactLink to={`/trb/task-list/${requestID}`}>
            <IconArrowBack className="margin-right-1 text-middle" />
            <span className="line-height-body-5">
              {t('requestFeedback.returnToTaskList')}
            </span>
          </UswdsReactLink>
        </div>
      </Grid>
    </GridContainer>
  );
};

export default DocumentsTaskList;
