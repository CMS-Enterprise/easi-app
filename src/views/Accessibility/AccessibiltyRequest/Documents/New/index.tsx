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
import { CreateAccessibilityRequestDocument } from 'queries/types/CreateAccessibilityRequestDocument';
import { GeneratePresignedUploadURL } from 'queries/types/GeneratePresignedUploadURL';
import { GetAccessibilityRequest } from 'queries/types/GetAccessibilityRequest';

import FileUpload from 'components/FileUpload';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { RadioField } from 'components/shared/RadioField';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import TextField from 'components/shared/TextField';
import { FileUploadForm } from 'types/files';
import {
  AccessibilityRequestDocumentCommonType,
  CreateAccessibilityRequestDocumentInput
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';

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

  const [selectedFile, setSelectedFile] = useState<File>();

  const [s3URL, setS3URL] = useState('');
  const [generateURL, generateURLStatus] = useMutation<
    GeneratePresignedUploadURL
  >(GeneratePresignedUploadURLQuery);
  const [createDocument, createDocumentStatus] = useMutation<
    CreateAccessibilityRequestDocument,
    CreateAccessibilityRequestDocumentInput
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
    setSelectedFile(file);
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
    if (!selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.put(s3URL, formData).then(() => {
      createDocument({
        variables: {
          mimeType: selectedFile.type,
          size: selectedFile.size,
          name: selectedFile.name,
          url: s3URL,
          requestID: accessibilityRequestId,
          commonDocumentType: values.documentType
            .commonType as AccessibilityRequestDocumentCommonType,
          otherDocumentTypeDescription: values.documentType.otherType
        }
      }).then(() => {
        history.push(`/508/requests/${accessibilityRequestId}`, {
          confirmationText: `${selectedFile.name} uploaded to ${data?.accessibilityRequest?.name}`
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
          <NavLink to={`/508/requests/${accessibilityRequestId}`}>
            {t('tabs.accessibilityRequests')}
          </NavLink>
        </SecondaryNav>
        <div className="grid-container">
          <Formik
            initialValues={{
              filename: '',
              file: {} as File,
              uploadURL: '',
              documentType: {
                commonType: null,
                otherType: ''
              }
            }}
            onSubmit={onSubmit}
          >
            {(formikProps: FormikProps<FileUploadForm>) => {
              const { errors, setFieldValue, values } = formikProps;
              const flatErrors = flattenErrors(errors);
              return (
                <Form onSubmit={formikProps.handleSubmit}>
                  <h1>
                    Upload a document to {data?.accessibilityRequest?.name}
                  </h1>
                  <Label htmlFor="file-upload">
                    Choose a document to upload
                    <FileUpload
                      id="file-upload"
                      name="file-upload"
                      accept=".pdf,.txt"
                      onChange={onChange}
                      onBlur={() => {}}
                      ariaDescribedBy=""
                    />
                  </Label>
                  {selectedFile && (
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
                                  values.documentType.commonType === commonType
                                }
                                id={`FileUpload-CommonType${commonType}`}
                                name="documentType.commonType"
                                label={getDocumentTypeLabel(commonType)}
                                onChange={() => {
                                  setFieldValue(
                                    'documentType.commonType',
                                    commonType
                                  );
                                  setFieldValue('documentType.otherType', '');
                                }}
                                value={commonType}
                              />
                            );
                          }
                        )}
                        <Field
                          as={RadioField}
                          checked={values.documentType.commonType === 'OTHER'}
                          id="FileUpload-CommonTypeOTHER"
                          name="documentType.commonType"
                          label={getDocumentTypeLabel(
                            AccessibilityRequestDocumentCommonType.OTHER
                          )}
                          onChange={() => {
                            setFieldValue('documentType.commonType', 'OTHER');
                          }}
                          value="OTHER"
                        />
                        {values.documentType.commonType === 'OTHER' && (
                          <div className="width-card-lg margin-left-4 margin-bottom-1">
                            <FieldGroup
                              scrollElement="documentType.otherType"
                              error={!!flatErrors['documentType.otherType']}
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
                                error={!!flatErrors['documentType.otherType']}
                                className="margin-top-0"
                                id="DocumentType-OtherType"
                                name="documentType.otherType"
                              />
                            </FieldGroup>
                          </div>
                        )}
                      </fieldset>
                    </FieldGroup>
                  )}
                  {selectedFile && (
                    <div className="padding-top-2">
                      <p>
                        To keep CMS safe, documents are scanned for viruses
                        after uploading. If something goes wrong, we&apos;ll let
                        you know.
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
                  )}
                </Form>
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
