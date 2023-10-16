import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeading from 'components/PageHeading';
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
      <PageHeading className="margin-top-0">
        {t('documents.uploadedDocuments')}
      </PageHeading>
      <DocumentsTable systemIntake={systemIntake} canEdit={false} />
    </div>
  );
};

export default Documents;
