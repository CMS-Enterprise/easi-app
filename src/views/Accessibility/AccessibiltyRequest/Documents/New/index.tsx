import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Form, Label } from '@trussworks/react-uswds';
import { Formik, FormikProps } from 'formik';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
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

  const [fileSelected, setFileSelected] = useState(false);

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return (
      <div>{`No request found matching id: ${accessibilityRequestId}`}</div>
    );
  }

  const onChange = () => {
    setFileSelected(true);
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
            onSubmit={() => {}}
          >
            {(formikProps: FormikProps<FileUploadForm>) => {
              return (
                <Form onSubmit={formikProps.handleSubmit}>
                  <h1>
                    Upload a document to{' '}
                    {data?.accessibilityRequest?.system.name}
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

                  {fileSelected && (
                    <div className="padding-top-2">
                      <p>
                        To keep CMS safe, documents are scanned for viruses
                        after uploading. If something goes wrong, we&apos;ll let
                        you know.
                      </p>
                      <Button type="submit" onClick={() => {}}>
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
