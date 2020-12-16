import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@trussworks/react-uswds';
import { Form, Formik, FormikProps } from 'formik';

import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import Label from 'components/shared/Label';
import { AppState } from 'reducers/rootReducer';
import { FileUploadModel } from 'types/files';
import { postFileUploadURL, putFileS3 } from 'types/routines';
import { uploadSchema } from 'validations/fileSchema';

const DocumentPrototype = () => {
  const { t } = useTranslation('action');
  const dispatch = useDispatch();

  const file = useSelector((state: AppState) => state.files);

  const dispatchUpload = () => {
    dispatch(
      putFileS3({
        ...file.form
      })
    );
  };

  return (
    <PageWrapper className="system-intake">
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <h1>Document Prototype</h1>
        <Formik
          initialValues={{
            filename: '',
            file: {} as File,
            uploadURL: ''
          }}
          onSubmit={dispatchUpload}
          validationSchema={uploadSchema}
        >
          {(formikProps: FormikProps<FileUploadModel>) => {
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

                      dispatch(
                        postFileUploadURL({
                          ...file
                        })
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
