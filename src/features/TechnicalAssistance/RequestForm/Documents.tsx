import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import { ApolloQueryResult } from '@apollo/client';
import {
  GetTrbRequestDocuments,
  GetTrbRequestDocumentsVariables
} from 'gql/legacyGQL/types/GetTrbRequestDocuments';

import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';

import DocumentsTable from './DocumentsTable';
import DocumentUpload from './DocumentUpload';
import Pager from './Pager';
import { FormStepComponentProps, StepSubmit } from '.';

export type RefetchDocuments = (
  variables?: Partial<GetTrbRequestDocumentsVariables> | undefined
) => Promise<ApolloQueryResult<GetTrbRequestDocuments>> | (() => void);

/**
 * Documents is a component of both the table list of uploaded documents
 * and the document upload form.
 */
function Documents({
  request,
  stepUrl,
  taskListUrl,
  setFormAlert,
  setStepSubmit
}: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const { t: gt } = useTranslation('general');

  const { view } = useParams<{
    view?: string;
  }>();

  const history = useHistory();
  const { url } = useRouteMatch();

  const [documentsCount, setDocumentsCount] = useState(0);
  const [refetchDocuments, setRefetchDocuments] = useState<RefetchDocuments>(
    () => () => {}
  );
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  const submitNoop: StepSubmit = async callback => {
    callback?.();
  };

  useEffect(() => {
    setStepSubmit(() => submitNoop);
  }, [setStepSubmit]);

  return (
    <Switch>
      {/* Documents table */}
      <Route exact path="/trb/requests/:id/documents">
        {loadingDocuments && (
          <div className="margin-y-10" data-testid="page-loading">
            <div className="text-center">
              <Spinner size="xl" aria-valuetext={gt('pageLoading')} aria-busy />
            </div>
          </div>
        )}

        {/* Open the document upload form */}
        <div className="margin-top-5 margin-bottom-4">
          <UswdsReactLink
            variant="unstyled"
            className="usa-button"
            to={`${url}/upload`}
          >
            {t('documents.addDocument')}
          </UswdsReactLink>
        </div>

        <DocumentsTable
          trbRequestId={request.id}
          setLoadingDocuments={setLoadingDocuments}
          setRefetchDocuments={setRefetchDocuments}
          setDocumentsCount={setDocumentsCount}
        />

        {!loadingDocuments && (
          <Pager
            className="margin-top-7"
            back={{
              onClick: () => {
                history.push(stepUrl.back);
              }
            }}
            next={{
              onClick: e => {
                history.push(stepUrl.next);
              },
              text: t(
                documentsCount
                  ? 'button.next'
                  : 'documents.continueWithoutAdding'
              ),
              outline: documentsCount === 0
            }}
            submit={submitNoop}
            taskListUrl={taskListUrl}
          />
        )}
      </Route>

      {/* Upload document form */}
      <Route exact path="/trb/requests/:id/documents/upload">
        <DocumentUpload
          setFormAlert={setFormAlert}
          refetchDocuments={refetchDocuments}
          view={view}
          isInitialRequest
        />
      </Route>
    </Switch>
  );
}

export default Documents;
