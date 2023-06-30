import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import useMessage from 'hooks/useMessage';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import DocumentsTable from './DocumentsTable';

import './index.scss';

type DocumentsProps = {
  systemIntake: SystemIntake;
};

/**
 * System intake document upload form step
 */
const Documents = ({ systemIntake }: DocumentsProps) => {
  const { t } = useTranslation();

  const history = useHistory();

  const { Message } = useMessage();

  const { documents } = systemIntake;

  return (
    <>
      <Message />

      <PageHeading className="margin-top-4 margin-bottom-1">
        {t('intake:documents.title')}
      </PageHeading>
      <p className="margin-top-1 font-body-md line-height-body-5 tablet:grid-col-12 desktop:grid-col-8">
        {t('intake:documents.tableDescription')}
      </p>

      <h4 className="margin-bottom-1 margin-top-5">
        {t('intake:documents.tableTitle')}
      </h4>

      <Button
        className="margin-bottom-1"
        type="button"
        onClick={() =>
          history.push(`/system/${systemIntake.id}/documents/upload`)
        }
      >
        {t(
          `technicalAssistance:documents.${
            documents.length ? 'addAnotherDocument' : 'addDocument'
          }`
        )}
      </Button>

      <DocumentsTable systemIntake={systemIntake} />

      <Pager
        className="margin-top-6 margin-bottom-8"
        next={{
          text: t(
            documents.length > 0
              ? 'Next'
              : 'intake:documents.continueWithoutDocuments'
          ),
          outline: documents.length === 0,
          onClick: () => history.push(`/system/${systemIntake.id}/review`)
        }}
        back={{
          onClick: () =>
            history.push(`/system/${systemIntake.id}/contract-details`)
        }}
        taskListUrl={`/governance-task-list/${systemIntake.id}`}
        border={false}
        submitDisabled
      />

      <PageNumber currentPage={4} totalPages={5} />
    </>
  );
};

export default Documents;
