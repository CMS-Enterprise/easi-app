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
  downloadTarget: '',
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
        form: action.payload,
        isLoading: true
      };
    case putFileS3.SUCCESS:
      return {
        ...state,
        files: [
          ...state.files,
          {
            ...prepareUploadedFileForApp(action.payload)
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
        downloadTarget: action.payload,
        isLoading: true
      };
    case getFileS3.SUCCESS:
      return {
        ...state,
        downloadTarget: action.payload
      };
    case getFileS3.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case getFileS3.FULFILL:
      return {
        ...state,
        isSaving: false
      };
    default:
      return state;
  }
}

export default fileUploadReducer;
