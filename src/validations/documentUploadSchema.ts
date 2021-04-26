import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const DocumentUploadValidationSchema: any = Yup.object().shape({
  file: Yup.mixed().nullable().required('Choose a document to upload'),
  documentType: Yup.object().when('file', {
    is: (value: string) => value,
    then: Yup.object().shape({
      commonType: Yup.string()
        .nullable()
        .required('Select the type of document you are uploading'),
      otherType: Yup.string().when('commonType', {
        is: 'OTHER',
        then: Yup.string().trim().required('Enter a document name')
      })
    })
  })
});
