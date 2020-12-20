import { Action } from 'redux-actions';

import {
  fileUploadFormInitialData,
  fileUploadTableInitialData,
  prepareFileUploadForApp,
  prepareUploadedFileForApp
} from 'data/files';
import { FileUploadState } from 'types/files';
import { getFileS3, postFileUploadURL, putFileS3 } from 'types/routines';

const initialState: FileUploadState = {
  form: fileUploadFormInitialData,
  files: [fileUploadTableInitialData],
  isLoading: null,
  isSaving: false,
  isUploaded: false,
  error: null
};

function fileUploadReducer(
  state = initialState,
  action: Action<any>
): FileUploadState {
  switch (action.type) {
    case postFileUploadURL.REQUEST:
      return {
        ...state,
        form: action.payload,
        isLoading: true
      };
    case postFileUploadURL.SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          ...prepareFileUploadForApp(action.payload)
        }
      };
    case postFileUploadURL.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case postFileUploadURL.FULFILL:
      return {
        ...state,
        isSaving: false
      };
    case putFileS3.REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case putFileS3.SUCCESS:
      return {
        ...state,
        files: [
          ...state.files,
          {
            ...prepareUploadedFileForApp(state.form)
          }
        ],
        isUploaded: true
      };
    case putFileS3.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case putFileS3.FULFILL:
      return {
        ...state,
        isSaving: false
      };
    case getFileS3.REQUEST:
      return {
        ...state,
        isLoading: true
      };
    default:
      return state;
  }
}

export default fileUploadReducer;
