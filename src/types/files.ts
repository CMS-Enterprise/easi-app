export type FileUploadModel = {
  file: File;
  filename: string;
  uploadURL: string;
};

// Redux store type for file upload state
export type FileUploadState = {
  form: FileUploadModel;
  files: FileUploadModel[];
  isLoading: boolean | null;
  isSaving: boolean;
  error: any;
  isUploaded: boolean;
};
