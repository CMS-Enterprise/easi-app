import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import useMessage from 'hooks/useMessage';

import DocumentsTable from './RequestForm/DocumentsTable';
import Breadcrumbs from './Breadcrumbs';

export type DocumentStatusType = 'success' | 'error';

const DocumentsTaskList = () => {
  const { t } = useTranslation('technicalAssistance');

  const { Message } = useMessage();

  const { id: requestID } = useParams<{
    id: string;
  }>();

  const [documentsCount, setDocumentsCount] = useState(0);
  const [documentMessage, setDocumentMessage] = useState('');
  const [documentStatus, setDocumentStatus] =
    useState<DocumentStatusType>('success');

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

        {/* Displays success message on this view from the document upload page */}
        <Message />

        {/* Displays document success/fail messages when removing a document on this view */}
        {documentMessage && (
          <Alert type={documentStatus} slim className="margin-y-4">
            {documentMessage}
          </Alert>
        )}

        <h1 className="margin-bottom-0 margin-top-6">
          {t('adminHome.supportingDocuments')}
        </h1>

        <p className="line-height-body-5 margin-top-0 margin-bottom-2">
          {t('documents.supportingDocuments.info')}
        </p>

        <UswdsReactLink to={`/trb/task-list/${requestID}`}>
          <Icon.ArrowBack className="margin-right-1 text-middle" />
          <span className="line-height-body-5">
            {t('requestFeedback.returnToTaskList')}
          </span>
        </UswdsReactLink>

        <div className="display-block margin-top-5 margin-bottom-4">
          <UswdsReactLink
            className={classNames('usa-button', {
              'usa-button usa-button--outline': documentsCount
            })}
            variant="unstyled"
            to={`/trb/task-list/${requestID}/documents/upload`}
          >
            {documentsCount
              ? t('documents.supportingDocuments.addAnother')
              : t('documents.addDocument')}
          </UswdsReactLink>
        </div>

        <DocumentsTable
          trbRequestId={requestID}
          setDocumentsCount={setDocumentsCount}
          setDocumentMessage={setDocumentMessage}
          setDocumentStatus={setDocumentStatus}
        />

        <div className="margin-top-5">
          <UswdsReactLink to={`/trb/task-list/${requestID}`}>
            <Icon.ArrowBack className="margin-right-1 text-middle" />
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
