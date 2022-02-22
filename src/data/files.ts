import { FileUploadForm, UploadedFile } from 'types/files';

export const fileUploadFormInitialData: FileUploadForm = {
  file: {} as File,
  filename: '',
  uploadURL: '',
  documentType: {
    commonType: null,
    otherType: ''
  }
};

export const fileUploadTableInitialData: UploadedFile = {
  filename: '',
  uploadURL: '',
  downloadURL: ''
};

export const prepareFileUploadForApi = (fileUpload: FileUploadForm): any => {
  const fileURL = {
    fileName: fileUpload?.file?.name,
    fileType: fileUpload?.file?.type,
    fileSize: fileUpload?.file?.size
  };

  return fileURL;
};

export const prepareFileUploadForApp = (fileUpload: any): FileUploadForm => {
  const upload = {
    file: fileUpload.file,
    filename: fileUpload.filename,
    uploadURL: fileUpload.URL,
    documentType: {
      commonType: null,
      otherType: ''
    }
  };
  return upload;
};

export const prepareUploadedFileForApp = (fileUpload: any): UploadedFile => {
  const uploadedFile = {
    file: fileUpload.file,
    filename: fileUpload.filename,
    uploadURL: fileUpload.uploadURL,
    downloadURL: ''
  };
  return uploadedFile;
};
