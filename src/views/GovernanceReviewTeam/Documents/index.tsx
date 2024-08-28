import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { SystemIntake } from 'queries/types/SystemIntake';
import DocumentsTable from 'views/SystemIntake/Documents/DocumentsTable';

type DocumentsProps = {
  systemIntake: SystemIntake;
};

/**
 * Documents view for GRT admin
 */
const Documents = ({ systemIntake }: DocumentsProps) => {
  const { t } = useTranslation('intake');

  return (
    <div>
      <PageHeading className="margin-y-0">
        {t('documents.supportingDocuments')}
      </PageHeading>
      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-4">
        {t('documents.adminDescription')}
      </p>

      {systemIntake.documents.length > 0 ? (
        <DocumentsTable
          systemIntakeId={systemIntake.id}
          documents={systemIntake.documents}
        />
      ) : (
        <Alert type="info" slim>
          {t('documents.noDocumentsAlert')}
        </Alert>
      )}
    </div>
  );
};

export default Documents;
