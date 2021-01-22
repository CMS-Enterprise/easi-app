import React from 'react';
import { Field, Form, Formik, FormikProps } from 'formik';

import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';

import FileUpload, { SelectedFile } from './index';

export default {
  title: 'File Upload',
  component: FileUpload
};

export const Default = () => {
  return (
    <FileUpload
      id="file-upload"
      name="file-upload"
      accept=".pdf,.txt"
      onChange={() => {}}
      onBlur={() => {}}
      ariaDescribedBy=""
    />
  );
};

export const Disabled = () => {
  return (
    <FileUpload
      id="file-upload-disabled"
      name="file-upload-disabled"
      accept=".pdf,.txt"
      onChange={() => {}}
      onBlur={() => {}}
      ariaDescribedBy=""
      disabled
    />
  );
};

export const Error = () => {
  return (
    <FieldGroup error>
      <FileUpload
        id="file-upload-disabled"
        name="file-upload-disabled"
        accept=".pdf,.txt"
        onChange={() => {}}
        onBlur={() => {}}
        ariaDescribedBy=""
      />
    </FieldGroup>
  );
};

type FileInputForm = {
  document: File | null;
};

export const WithFormik = () => {
  return (
    <Formik onSubmit={() => {}} initialValues={{ document: null }}>
      {(formikProps: FormikProps<FileInputForm>) => {
        const {
          values: { document },
          setFieldValue
        } = formikProps;

        return (
          <Form>
            <Label htmlFor="Storybook-FileInput">Document</Label>
            <HelpText id="Storybook-FileInputHelp">
              This document can be a PDF or DOC and can be no larger than 5 MB.
              Limit 1 file
            </HelpText>
            <Field
              as={FileUpload}
              id="Storybook-FileInput"
              name="document"
              ariaDescribedBy="Storybook-FileInputHelp Storybook-SelectedFile"
              accept=".pdf,.doc"
              onChange={event => {
                setFieldValue('document', event.currentTarget.files[0]);
              }}
            />
            {document && document.name && (
              <SelectedFile
                id="Storybook-SelectedFile"
                fileName={document.name}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
