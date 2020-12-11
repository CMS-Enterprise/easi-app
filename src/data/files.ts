import { FileUploadModel } from 'types/files';

export const fileUploadInitialData: FileUploadModel = {
  file: {} as File,
  uploadURL: ''
};

export const prepareFileUploadForApi = (fileUpload: FileUploadModel): any => {
  console.log(fileUpload);
  return fileUpload;
};

export const prepareFileUploadForApp = (fileUpload: any): FileUploadModel => {
  return fileUpload;
};
