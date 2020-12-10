import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import Label from 'components/shared/Label';
import { UploadForm } from 'types/files';
import { uploadSchema } from 'validations/fileSchema';

const DocumentPrototype = () => {
  const { t } = useTranslation('action');

  const dispatchUpload = (values: UploadForm) => {
    alert(
      JSON.stringify(
        {
          fileName: values.file.name,
          type: values.file.type,
          size: `${values.file.size} bytes`
        },
        null,
        2
      )
    );
  };

  return (
    <PageWrapper className="system-intake">
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <h1>Document Prototype</h1>
        <Formik
          initialValues={{ file: null }}
          onSubmit={dispatchUpload}
          validationSchema={uploadSchema}
        >
          {(formikProps: FormikProps<UploadForm>) => {
            return (
              <Form onSubmit={formikProps.handleSubmit}>
                <div className="form-group">
                  <Label htmlFor="file">File upload</Label>
                  <input
                    id="file-input-specific"
                    name="file"
                    type="file"
                    onChange={event => {
                      formikProps.setFieldValue(
                        'file',
                        event.currentTarget.files[0]
                      );
                    }}
                    className="form-control"
                  />
                </div>
                <Button type="submit" className="btn btn-primary">
                  {t('uploadFile.submit')}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </MainContent>
    </PageWrapper>
  );
};

export default DocumentPrototype;
