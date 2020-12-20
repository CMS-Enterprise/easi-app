import { FileUploadForm, UploadedFile } from 'types/files';

export const fileUploadFormInitialData: FileUploadForm = {
  file: {} as File,
  filename: '',
  uploadURL: ''
};

export const fileUploadTableInitialData: UploadedFile = {
  filename: '',
  uploadURL: '',
  downloadURL: ''
};

export const prepareFileUploadForApi = (fileUpload: FileUploadForm): any => {
  const fileURL = {
    fileName: fileUpload.file.name,
    fileType: fileUpload.file.type,
    fileSize: fileUpload.file.size
  };

  return fileURL;
};

export const prepareFileUploadForApp = (fileUpload: any): FileUploadForm => {
  const upload = {
    filename: fileUpload.filename,
    uploadURL: fileUpload.URL
  };
  return upload;
};

export const prepareUploadedFileForApp = (fileUpload: any): UploadedFile => {
  const uploadedFile = {
    filename: fileUpload.filename,
    uploadURL: fileUpload.uploadURL
  };
  return uploadedFile;
};
