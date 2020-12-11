import { Action } from 'redux-actions';

import { fileUploadInitialData, prepareFileUploadForApp } from 'data/files';
import { FileUploadState } from 'types/files';
import { postFileUploadURL } from 'types/routines';

const initialState: FileUploadState = {
  form: fileUploadInitialData,
  isLoading: null,
  isSaving: false,
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
        isLoading: true
      };
    case postFileUploadURL.SUCCESS:
      return {
        ...state,
        form: prepareFileUploadForApp(action.payload)
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
    default:
      return state;
  }
}

export default fileUploadReducer;
