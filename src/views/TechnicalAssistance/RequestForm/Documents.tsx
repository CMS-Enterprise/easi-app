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

import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import {
  GetTrbRequestDocuments,
  GetTrbRequestDocumentsVariables
} from 'queries/types/GetTrbRequestDocuments';

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
        {/* <div>
          <Breadcrumbs
            items={[
              { text: t('heading'), url: '/trb' },
              {
                text: t('taskList.heading'),
                url: taskListUrl
              },
              {
                text: t('requestForm.heading'),
                url: `/trb/requests/${request.id}/documents`
              },
              { text: t('documents.upload.title') }
            ]}
          />
          {isUploadError && (
            <Alert type="error" slim className="document-upload-error">
              {t('documents.upload.error')}
            </Alert>
          )}
          <Form className="maxw-full" onSubmit={submit}>
            <PageHeading className="margin-bottom-1">
              {t('documents.upload.title')}
            </PageHeading>
            <Grid row gap>
              <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                <div>{t('documents.upload.subtitle')}</div>
                <Controller
                  name="fileData"
                  control={control}
                  // eslint-disable-next-line no-shadow
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <FormGroup error={!!error} className="margin-top-5">
                        <Label htmlFor={field.name} error={!!error}>
                          {t('documents.upload.documentUpload')}
                        </Label>
                        {error && (
                          <ErrorMessage>{t('errors.selectFile')}</ErrorMessage>
                        )}
                        <FileInput
                          id={field.name}
                          name={field.name}
                          onBlur={field.onBlur}
                          onChange={e => {
                            field.onChange(e.currentTarget?.files?.[0]);
                          }}
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                        />
                      </FormGroup>
                    );
                  }}
                />
                <Controller
                  name="documentType"
                  control={control}
                  // eslint-disable-next-line no-shadow
                  render={({ field, fieldState: { error } }) => (
                    <FormGroup error={!!error}>
                      <Fieldset legend={t('documents.upload.whatType')}>
                        {error && (
                          <ErrorMessage>
                            {t('errors.makeSelection')}
                          </ErrorMessage>
                        )}
                        {[
                          'ARCHITECTURE_DIAGRAM',
                          'PRESENTATION_SLIDE_DECK',
                          'BUSINESS_CASE',
                          'OTHER'
                        ].map(val => (
                          <Radio
                            key={val}
                            id={`${field.name}-${val}`}
                            data-testid={`${field.name}-${val}`}
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            label={t(`documents.upload.type.${val}`)}
                            value={val}
                          />
                        ))}
                      </Fieldset>
                    </FormGroup>
                  )}
                />
                {watch('documentType') === 'OTHER' && (
                  <div className="margin-left-4">
                    <Controller
                      name="otherTypeDescription"
                      control={control}
                      // eslint-disable-next-line no-shadow
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup className="margin-top-1" error={!!error}>
                          <Label htmlFor={field.name} error={!!error}>
                            {t('documents.upload.whatKind')}
                          </Label>
                          {error && (
                            <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
                          )}
                          <TextInput
                            id={field.name}
                            name={field.name}
                            type="text"
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            value={field.value || ''}
                            validationStatus={error && 'error'}
                          />
                        </FormGroup>
                      )}
                    />
                  </div>
                )}
                <Alert type="info" slim className="margin-top-5">
                  {t('documents.upload.toKeepCmsSafe')}
                </Alert>
              </Grid>
            </Grid>
            <div>
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
                className="margin-top-4"
              >
                {t('documents.upload.uploadDocument')}
              </Button>
            </div>
          </Form>
          <div className="margin-top-2">
            <UswdsReactLink
              variant="unstyled"
              to={`/trb/requests/${request.id}/documents`}
            >
              <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
              {t('documents.upload.dontUploadAndReturn')}
            </UswdsReactLink>
          </div>
        </div> */}
      </Route>
    </Switch>
  );
}

export default Documents;
