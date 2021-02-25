import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Label } from '@trussworks/react-uswds';
import axios from 'axios';
import { Field, Formik, FormikProps } from 'formik';
import { isUndefined } from 'lodash';
import CreateAccessibilityRequestDocumentQuery from 'queries/CreateAccessibilityRequestDocumentQuery';
import GeneratePresignedUploadURLQuery from 'queries/GeneratePresignedUploadURLQuery';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import {
  CreateAccessibilityRequestDocument,
  CreateAccessibilityRequestDocumentVariables
} from 'queries/types/CreateAccessibilityRequestDocument';
import { GeneratePresignedUploadURL } from 'queries/types/GeneratePresignedUploadURL';
import { GetAccessibilityRequest } from 'queries/types/GetAccessibilityRequest';

import FileUpload from 'components/FileUpload';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { RadioField } from 'components/shared/RadioField';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import TextField from 'components/shared/TextField';
import { FileUploadForm } from 'types/files';
import { AccessibilityRequestDocumentCommonType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { DocumentUploadValidationSchema } from 'validations/documentUploadSchema';

const New = () => {
  const { t } = useTranslation('accessibility');
  const history = useHistory();
  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const { loading, error, data } = useQuery<GetAccessibilityRequest>(
    GetAccessibilityRequestQuery,
    {
      variables: {
        id: accessibilityRequestId
      }
    }
  );

  const [s3URL, setS3URL] = useState('');
  const [generateURL, generateURLStatus] = useMutation<
    GeneratePresignedUploadURL
  >(GeneratePresignedUploadURLQuery);
  const [createDocument, createDocumentStatus] = useMutation<
    CreateAccessibilityRequestDocument,
    CreateAccessibilityRequestDocumentVariables
  >(CreateAccessibilityRequestDocumentQuery);

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return (
      <div>{`No request found matching id: ${accessibilityRequestId}`}</div>
    );
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.currentTarget?.files?.[0];
    if (!file) {
      return;
    }
    generateURL({
      variables: {
        input: {
          fileName: file?.name,
          mimeType: file?.type,
          size: file?.size
        }
      }
    }).then(result => {
      const url = result.data?.generatePresignedUploadURL?.url;
      if (
        generateURLStatus.error ||
        result.data?.generatePresignedUploadURL?.userErrors ||
        isUndefined(url)
      ) {
        // eslint-disable-next-line
        console.error('Could not fetch presigned S3 URL');
      } else {
        setS3URL(url || '');
      }
    });
  };

  const onSubmit = (values: FileUploadForm) => {
    if (!values.file.name) {
      return;
    }
    const formData = new FormData();
    formData.append('file', values.file);

    axios.put(s3URL, formData).then(() => {
      createDocument({
        variables: {
          input: {
            mimeType: values.file.type,
            size: values.file.size,
            name: values.file.name,
            url: s3URL,
            requestID: accessibilityRequestId,
            commonDocumentType: values.documentType
              .commonType as AccessibilityRequestDocumentCommonType,
            otherDocumentTypeDescription: values.documentType.otherType
          }
        }
      }).then(() => {
        history.push(`/508/requests/${accessibilityRequestId}`, {
          confirmationText: `${values.file.name} uploaded to ${data?.accessibilityRequest?.name}`
        });
      });
    });
  };

  const getDocumentTypeLabel = (
    commonType: AccessibilityRequestDocumentCommonType
  ): string => {
    switch (commonType) {
      case 'AWARDED_VPAT':
        return 'Awarded VPAT';
      case 'TEST_PLAN':
        return 'Test plan';
      case 'TESTING_VPAT':
        return 'Testing VPAT';
      case 'TEST_RESULTS':
        return 'Test results';
      case 'REMEDIATION_PLAN':
        return 'Remediation plan';
      case 'OTHER':
        return 'Other';
      default:
        return '';
    }
  };

  return (
    <PageWrapper className="accessibility-request">
      <Header />
      <MainContent className="margin-bottom-5">
        <SecondaryNav>
          <NavLink to="/">{t('tabs.accessibilityRequests')}</NavLink>
        </SecondaryNav>
        <div className="grid-container">
          <Formik
            initialValues={{
              file: {} as File,
              documentType: {
                commonType: null,
                otherType: ''
              }
            }}
            onSubmit={onSubmit}
            validationSchema={DocumentUploadValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
          >
            {(formikProps: FormikProps<FileUploadForm>) => {
              const { errors, setFieldValue, values } = formikProps;
              const flatErrors = flattenErrors(errors);
              return (
                <>
                  {Object.keys(errors).length > 0 && (
                    <ErrorAlert
                      testId="document-upload-errors"
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
                  <PageHeading>
                    Upload a document to {data?.accessibilityRequest?.name}
                  </PageHeading>
                  <div className="grid-col-9">
                    <Form onSubmit={formikProps.handleSubmit} large>
                      <Label htmlFor="FileUpload-File">
                        Choose a document to upload
                      </Label>
                      <Field
                        as={FileUpload}
                        id="FileUpload-File"
                        name="FileUpload-File"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          onChange(e);
                          setFieldValue('file', e.currentTarget?.files?.[0]);
                        }}
                      />
                      {values.file && (
                        <>
                          <FieldGroup
                            scrollElement="documentType.commonType"
                            error={!!flatErrors['documentType.commonType']}
                          >
                            <fieldset className="usa-fieldset margin-top-4">
                              <legend className="usa-label margin-bottom-1">
                                What type of document are you uploading?
                              </legend>
                              <FieldErrorMsg>
                                {flatErrors['documentType.commonType']}
                              </FieldErrorMsg>
                              {([
                                'AWARDED_VPAT',
                                'TEST_PLAN',
                                'TESTING_VPAT',
                                'TEST_RESULTS',
                                'REMEDIATION_PLAN'
                              ] as AccessibilityRequestDocumentCommonType[]).map(
                                commonType => {
                                  return (
                                    <Field
                                      key={`FileUpload-CommonType${commonType}`}
                                      as={RadioField}
                                      checked={
                                        values.documentType.commonType ===
                                        commonType
                                      }
                                      id={`FileUpload-CommonType${commonType}`}
                                      name="documentType.commonType"
                                      label={getDocumentTypeLabel(commonType)}
                                      onChange={() => {
                                        setFieldValue(
                                          'documentType.commonType',
                                          commonType
                                        );
                                        setFieldValue(
                                          'documentType.otherType',
                                          ''
                                        );
                                      }}
                                      value={commonType}
                                    />
                                  );
                                }
                              )}
                              <Field
                                as={RadioField}
                                checked={
                                  values.documentType.commonType === 'OTHER'
                                }
                                id="FileUpload-CommonTypeOTHER"
                                name="documentType.commonType"
                                label={getDocumentTypeLabel(
                                  AccessibilityRequestDocumentCommonType.OTHER
                                )}
                                value="OTHER"
                              />
                              {values.documentType.commonType === 'OTHER' && (
                                <div className="width-card-lg margin-left-4 margin-bottom-1">
                                  <FieldGroup
                                    scrollElement="documentType.otherType"
                                    error={
                                      !!flatErrors['documentType.otherType']
                                    }
                                  >
                                    <Label
                                      htmlFor="FileUpload-OtherType"
                                      className="margin-bottom-1"
                                      style={{ marginTop: '0.5em' }}
                                    >
                                      Document name
                                    </Label>
                                    <FieldErrorMsg>
                                      {flatErrors['documentType.otherType']}
                                    </FieldErrorMsg>
                                    <Field
                                      as={TextField}
                                      error={
                                        !!flatErrors['documentType.otherType']
                                      }
                                      className="margin-top-0"
                                      id="DocumentType-OtherType"
                                      name="documentType.otherType"
                                    />
                                  </FieldGroup>
                                </div>
                              )}
                            </fieldset>
                          </FieldGroup>
                          <div className="padding-top-2">
                            <p>
                              To keep CMS safe, documents are scanned for
                              viruses after uploading. If something goes wrong,
                              we&apos;ll let you know.
                            </p>
                            <Button
                              type="submit"
                              disabled={
                                generateURLStatus.loading ||
                                createDocumentStatus.loading
                              }
                            >
                              Upload document
                            </Button>
                          </div>
                        </>
                      )}
                    </Form>
                  </div>
                </>
              );
            }}
          </Formik>

          <p className="padding-top-2">
            <Link to={`/508/requests/${accessibilityRequestId}`}>
              Don&apos;t upload and return to request page
            </Link>
          </p>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default New;
