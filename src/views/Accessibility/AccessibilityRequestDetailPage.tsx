import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Link as UswdsLink
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { DateTime } from 'luxon';
import { DeleteAccessibilityRequestDocumentQuery } from 'queries/AccessibilityRequestDocumentQueries';
import CreateAccessibilityRequestNoteQuery from 'queries/CreateAccessibilityRequestNoteQuery';
import DeleteAccessibilityRequestQuery from 'queries/DeleteAccessibilityRequestQuery';
import DeleteTestDateQuery from 'queries/DeleteTestDateQuery';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import {
  CreateAccessibilityRequestNote,
  CreateAccessibilityRequestNoteVariables
} from 'queries/types/CreateAccessibilityRequestNote';
import {
  DeleteAccessibilityRequest,
  DeleteAccessibilityRequestVariables
} from 'queries/types/DeleteAccessibilityRequest';
import {
  DeleteAccessibilityRequestDocument,
  DeleteAccessibilityRequestDocumentVariables
} from 'queries/types/DeleteAccessibilityRequestDocument';
import { DeleteTestDate } from 'queries/types/DeleteTestDate';
import {
  GetAccessibilityRequest,
  GetAccessibilityRequest_accessibilityRequest_testDates as TestDateType,
  GetAccessibilityRequestVariables
} from 'queries/types/GetAccessibilityRequest';

import AccessibilityDocumentsList from 'components/AccessibilityDocumentsList';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import { TabPanel, Tabs } from 'components/Tabs';
import TestDateCard from 'components/TestDateCard';
import useMessage from 'hooks/useMessage';
import { AppState } from 'reducers/rootReducer';
import {
  CreateNoteForm,
  DeleteAccessibilityRequestForm
} from 'types/accessibility';
import { AccessibilityRequestDeletionReason } from 'types/graphql-global-types';
import { accessibilityRequestStatusMap } from 'utils/accessibilityRequest';
import { formatDate } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import user from 'utils/user';
import accessibilitySchema from 'validations/accessibilitySchema';
import { NotFoundPartial } from 'views/NotFound';

import './index.scss';

const AccessibilityRequestDetailPage = () => {
  const { t } = useTranslation('accessibility');
  const [isModalOpen, setModalOpen] = useState(false);
  const { message, showMessage, showMessageOnNextPage } = useMessage();
  const flags = useFlags();
  const history = useHistory();
  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const { loading, error, data, refetch } = useQuery<
    GetAccessibilityRequest,
    GetAccessibilityRequestVariables
  >(GetAccessibilityRequestQuery, {
    variables: {
      id: accessibilityRequestId
    }
  });
  const [mutateDeleteRequest] = useMutation<
    DeleteAccessibilityRequest,
    DeleteAccessibilityRequestVariables
  >(DeleteAccessibilityRequestQuery);
  const [mutateCreateNote] = useMutation<
    CreateAccessibilityRequestNote,
    CreateAccessibilityRequestNoteVariables
  >(CreateAccessibilityRequestNoteQuery);

  const userEuaId = useSelector((state: AppState) => state.auth.euaId);

  const removeRequest = (values: DeleteAccessibilityRequestForm) => {
    mutateDeleteRequest({
      variables: {
        input: {
          id: accessibilityRequestId,
          reason: values.deletionReason as AccessibilityRequestDeletionReason
        }
      }
    }).then(response => {
      if (!response.errors) {
        showMessageOnNextPage(
          t('requestDetails.removeConfirmationText', {
            requestName
          })
        );
        history.push('/');
      }
    });
  };

  const createNote = (
    values: CreateNoteForm,
    { resetForm }: FormikHelpers<CreateNoteForm>
  ) => {
    mutateCreateNote({
      variables: {
        input: {
          requestID: accessibilityRequestId,
          note: values.noteText,
          shouldSendEmail: values.shouldSendEmail
        }
      }
    }).then(() => {
      showMessage(t('requestDetails.notes.confirmation', { requestName }));
      resetForm({});
    });
  };

  const [deleteTestDateMutation] = useMutation<DeleteTestDate>(
    DeleteTestDateQuery,
    {
      errorPolicy: 'all'
    }
  );

  const deleteTestDate = (testDate: TestDateType) => {
    deleteTestDateMutation({
      variables: {
        input: {
          id: testDate.id
        }
      }
    }).then(() => {
      refetch();
      showMessage(
        t('removeTestDate.confirmation', {
          date: formatDate(testDate.date),
          requestName
        })
      );
    });
  };

  const [removeDocumentMutation] = useMutation<
    DeleteAccessibilityRequestDocument,
    DeleteAccessibilityRequestDocumentVariables
  >(DeleteAccessibilityRequestDocumentQuery);

  const removeDocument = (
    id: string,
    documentTypeAsString: string,
    callback: () => void
  ) => {
    removeDocumentMutation({
      variables: {
        input: {
          id
        }
      }
    }).then(() => {
      refetch();
      if (document) {
        showMessage(`${documentTypeAsString} removed from ${requestName}`);
      }
      callback();
    });
  };

  const requestName = data?.accessibilityRequest?.name || '';
  const requestOwnerEuaId = data?.accessibilityRequest?.euaUserId || '';
  const systemName = data?.accessibilityRequest?.system.name || '';
  const submittedAt = data?.accessibilityRequest?.submittedAt || '';
  const lcid = data?.accessibilityRequest?.system.lcid;
  const businessOwnerName =
    data?.accessibilityRequest?.system?.businessOwner?.name;
  const businessOwnerComponent =
    data?.accessibilityRequest?.system?.businessOwner?.component;
  const documents = data?.accessibilityRequest?.documents || [];
  const testDates = data?.accessibilityRequest?.testDates || [];

  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isAccessibilityTeam = user.isAccessibilityTeam(userGroups, flags);
  const hasDocuments = documents.length > 0;
  const statusEnum = data?.accessibilityRequest?.statusRecord.status;
  const requestStatus = accessibilityRequestStatusMap[`${statusEnum}`];

  const uploadDocumentLink = (
    <UswdsLink
      className="usa-button"
      variant="unstyled"
      asCustom={Link}
      to={`/508/requests/${accessibilityRequestId}/documents/new`}
      data-testid="upload-new-document"
    >
      {t('requestDetails.documentUpload')}
    </UswdsLink>
  );

  const bodyWithDocumentsTable = (
    <>
      <h2 className="margin-top-0">{t('requestDetails.documents.label')}</h2>
      {uploadDocumentLink}
      <div className="margin-top-6">
        <AccessibilityDocumentsList
          documents={documents}
          requestName={requestName}
          removeDocument={removeDocument}
        />
      </div>
    </>
  );

  const bodyNoDocumentsBusinessOwner = (
    <>
      <div className="margin-bottom-3">
        <h2 className="margin-y-0 font-heading-lg">
          {t('requestDetails.documents.noDocs.heading')}
        </h2>
        <p className="line-height-body-4">
          <Trans i18nKey="accessibility:requestDetails.documents.noDocs.description">
            indexZero
            <UswdsLink
              className="display-inline-block"
              target="_blank"
              rel="noopener noreferrer"
              href="/508/templates"
            >
              linkText
            </UswdsLink>
            indexOne
          </Trans>
        </p>
      </div>
      {uploadDocumentLink}
    </>
  );
  const documentsTab = hasDocuments
    ? bodyWithDocumentsTable
    : bodyNoDocumentsBusinessOwner;

  const notesTab = (
    <>
      <div className="usa-sr-only">
        <UswdsLink href="#CreateAccessibilityRequestNote-NoteText">
          {t('requestDetails.notes.srOnlyAddNoteLink')}
        </UswdsLink>
      </div>
      <div
        role="region"
        aria-label="add new note"
        className="margin-y-2"
        id="notes-form"
      >
        <Formik
          initialValues={{
            noteText: '',
            shouldSendEmail: false
          }}
          onSubmit={createNote}
          validationSchema={accessibilitySchema.noteForm}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<CreateNoteForm>) => {
            const { values, errors, setFieldValue } = formikProps;
            const flatErrors = flattenErrors(errors);
            return (
              <>
                {Object.keys(errors).length > 0 && (
                  <ErrorAlert
                    testId="create-accessibility-note-errors"
                    classNames="margin-bottom-4 margin-top-4"
                    heading="There is a problem"
                  >
                    {Object.keys(flatErrors).map(key => {
                      return (
                        <ErrorAlertMessage
                          key={`Error.${key}`}
                          errorKey={key}
                          message={flatErrors[key]}
                        />
                      );
                    })}
                  </ErrorAlert>
                )}
                <Form className="usa-form maxw-full ">
                  <h3>{t('requestDetails.notes.addNote')}</h3>
                  <FieldGroup className="margin-bottom-2">
                    <FieldErrorMsg>{flatErrors.noteText}</FieldErrorMsg>
                    <Field
                      as={TextAreaField}
                      id="CreateAccessibilityRequestNote-NoteText"
                      maxLength={2000}
                      error={!!flatErrors.noteText}
                      className="accessibility-request__note-field"
                      name="noteText"
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Field
                      as={CheckboxField}
                      checked={values.shouldSendEmail}
                      id="CreateAccessibilityRequestNote-ShouldSendEmail"
                      name="shouldSendEmail"
                      label="Email the 508 team about this note"
                      value="ShouldSendEmail"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue(`shouldSendEmail`, e.target.checked);
                      }}
                    />
                  </FieldGroup>
                  <Button className="margin-top-2" type="submit">
                    {t('requestDetails.notes.submit')}
                  </Button>
                </Form>
              </>
            );
          }}
        </Formik>
      </div>
    </>
  );

  if (loading) {
    return <div>Loading</div>;
  }

  if (!data) {
    return (
      <div className="grid-container">
        <NotFoundPartial />
      </div>
    );
  }

  // What type of errors can we get/return?
  // How can we actually use the errors?
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <div>
      <div className="bg-primary-lighter">
        <div className="grid-container padding-x-5 padding-bottom-3 padding-top-5">
          <BreadcrumbBar variant="wrap" className="bg-transparent">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>Home</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{requestName}</Breadcrumb>
          </BreadcrumbBar>
          {message && (
            <Alert
              className="margin-top-4"
              type="success"
              role="alert"
              heading="Success"
            >
              {message}
            </Alert>
          )}
          <PageHeading
            aria-label={`${requestName} current status ${requestStatus}`}
          >
            {requestName}
          </PageHeading>
          <dl>
            <dt data-testid="current-status-dt">Current status</dt>
            <dd
              data-testid="current-status-dd"
              className="bg-warning-lighter padding-05 display-inline-block margin-top-1 margin-left-0"
            >
              {requestStatus}
            </dd>
          </dl>
          {isAccessibilityTeam && (
            <UswdsLink
              asCustom={Link}
              to={`/508/requests/${accessibilityRequestId}/change-status`}
              aria-label="Change status"
            >
              Change
            </UswdsLink>
          )}
        </div>
      </div>
      <div className="grid-container margin-top-2 padding-top-6 padding-top">
        <div className="grid-row grid-gap-lg">
          <div className="grid-col-8">
            {isAccessibilityTeam ? (
              <Tabs>
                <TabPanel id="Documents" tabName="Documents">
                  <div className="margin-top-2">{bodyWithDocumentsTable}</div>
                </TabPanel>
                <TabPanel id="Notes" tabName="Notes">
                  {notesTab}
                </TabPanel>
              </Tabs>
            ) : (
              documentsTab
            )}
          </div>
          <div className="grid-col-1" />
          <div className="grid-col-3">
            <div className="accessibility-request__side-nav">
              <div>
                <h2 className="margin-top-2 margin-bottom-3">
                  Test Dates and Scores
                </h2>
                {[...testDates]
                  .sort(
                    (a, b) =>
                      DateTime.fromISO(a.date).toMillis() -
                      DateTime.fromISO(b.date).toMillis()
                  )
                  .map((testDate, index) => (
                    <TestDateCard
                      key={testDate.id}
                      testDate={testDate}
                      testIndex={index + 1}
                      requestName={requestName}
                      requestId={accessibilityRequestId}
                      isEditableDeletable={isAccessibilityTeam}
                      handleDeleteTestDate={deleteTestDate}
                    />
                  ))}
                {isAccessibilityTeam && (
                  <Link
                    to={`/508/requests/${accessibilityRequestId}/test-date`}
                    className="margin-bottom-3 display-block"
                    aria-label="Add a test date"
                  >
                    Add a date
                  </Link>
                )}
              </div>
              <div className="accessibility-request__other-details">
                <h3>{t('requestDetails.other')}</h3>
                <dl>
                  <dt className="margin-bottom-1">
                    {t('intake:fields.submissionDate')}
                  </dt>
                  <dd className="margin-0 margin-bottom-2">
                    {formatDate(submittedAt)}
                  </dd>
                  <dt className="margin-bottom-1">
                    {t('intake:fields.businessOwner')}
                  </dt>
                  <dd className="margin-0 margin-bottom-2">
                    {businessOwnerName}, {businessOwnerComponent}
                  </dd>
                  <dt className="margin-bottom-1">
                    {t('intake:fields:projectName')}
                  </dt>
                  <dd className="margin-0 margin-bottom-3">{systemName}</dd>
                  <dt className="margin-bottom-1">{t('intake:lifecycleId')}</dt>
                  <dd className="margin-0 margin-bottom-3">{lcid}</dd>
                </dl>
              </div>
              <UswdsLink
                className="display-inline-block margin-top-3"
                target="_blank"
                rel="noopener noreferrer"
                href="/508/templates"
              >
                {t('requestDetails.testingTemplates')}
              </UswdsLink>
              <UswdsLink
                className="display-inline-block margin-top-3"
                target="_blank"
                rel="noopener noreferrer"
                href="/508/testing-overview"
              >
                {t('requestDetails.testingSteps')}
              </UswdsLink>
              {userEuaId === requestOwnerEuaId && (
                <button
                  type="button"
                  className="accessibility-request__remove-request"
                  onClick={() => setModalOpen(true)}
                >
                  {t('requestDetails.remove')}
                </button>
              )}
              <Modal
                isOpen={isModalOpen}
                closeModal={() => setModalOpen(false)}
              >
                <PageHeading
                  headingLevel="h2"
                  className="margin-top-0 line-height-heading-2 margin-bottom-2"
                >
                  {t('requestDetails.modal.header', {
                    requestName
                  })}
                </PageHeading>
                <span>{t('requestDetails.modal.subhead')}</span>

                <Formik
                  initialValues={{
                    deletionReason: ''
                  }}
                  onSubmit={removeRequest}
                  validationSchema={accessibilitySchema.deleteForm}
                  validateOnBlur={false}
                  validateOnChange={false}
                  validateOnMount={false}
                >
                  {(
                    formikProps: FormikProps<DeleteAccessibilityRequestForm>
                  ) => {
                    const { errors, values } = formikProps;
                    const flatErrors = flattenErrors(errors);
                    return (
                      <>
                        {Object.keys(errors).length > 0 && (
                          <ErrorAlert
                            testId="remove-accessibility-request-errors"
                            classNames="margin-bottom-4 margin-top-4"
                            heading="There is a problem"
                          >
                            {Object.keys(flatErrors).map(key => {
                              return (
                                <ErrorAlertMessage
                                  key={`Error.${key}`}
                                  errorKey={key}
                                  message={flatErrors[key]}
                                />
                              );
                            })}
                          </ErrorAlert>
                        )}
                        <Form className="usa-form usa-form--large">
                          <FieldGroup
                            scrollElement="deletionReason"
                            error={!!flatErrors.deletionReason}
                          >
                            <fieldset className="usa-fieldset margin-top-4">
                              <legend className="usa-label">
                                {t('removeAccessibilityRequest.reason')}
                              </legend>
                              <FieldErrorMsg>
                                {flatErrors.deletionReason}
                              </FieldErrorMsg>
                              {([
                                'INCORRECT_APPLICATION_AND_LIFECYCLE_ID',
                                'NO_TESTING_NEEDED',
                                'OTHER'
                              ] as AccessibilityRequestDeletionReason[]).map(
                                reason => {
                                  return (
                                    <Field
                                      key={`RemoveAccessibilityRequest-${reason}`}
                                      as={RadioField}
                                      checked={values.deletionReason === reason}
                                      id={`RemoveAccessibilityRequest-${reason}`}
                                      name="deletionReason"
                                      label={t(
                                        `removeAccessibilityRequest.${reason}`
                                      )}
                                      value={reason}
                                    />
                                  );
                                }
                              )}
                            </fieldset>
                          </FieldGroup>

                          <div className="display-flex margin-top-2">
                            <Button type="submit" className="margin-right-5">
                              {t('requestDetails.modal.confirm')}
                            </Button>
                            <Button
                              type="button"
                              unstyled
                              onClick={() => setModalOpen(false)}
                            >
                              {t('requestDetails.modal.cancel')}
                            </Button>
                          </div>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityRequestDetailPage;
