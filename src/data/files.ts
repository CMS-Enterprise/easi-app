import { FileUploadModel } from 'types/files';

export const fileUploadInitialData: FileUploadModel = {
  file: {} as File,
  filename: '',
  uploadURL: ''
};

export const prepareFileUploadForApi = (fileUpload: FileUploadModel): any => {
  return fileUpload;
};

export const prepareFileUploadForApp = (fileUpload: any): FileUploadModel => {
  const upload = {
    filename: fileUpload.filename,
    uploadURL: fileUpload.URL
  };
  return upload;
};
