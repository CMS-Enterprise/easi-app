import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Label } from '@trussworks/react-uswds';
import axios from 'axios';
import { Formik, FormikProps } from 'formik';
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
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import { FileUploadForm } from 'types/files';

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
    CreateAccessibilityRequestDocument
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

  const onSubmit = () => {
    if (!selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.put(s3URL, formData).then(() => {
      createDocument({
        variables: {
          input: {
            mimeType: selectedFile.type,
            size: selectedFile.size,
            name: selectedFile.name,
            url: s3URL,
            requestID: accessibilityRequestId
          }
        }
      }).then(() => {
        history.push(`/508/requests/${accessibilityRequestId}`, {
          confirmationText: `${selectedFile.name} uploaded to ${data?.accessibilityRequest?.name}`
        });
      });
    });
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
              uploadURL: ''
            }}
            onSubmit={onSubmit}
          >
            {(formikProps: FormikProps<FileUploadForm>) => {
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
