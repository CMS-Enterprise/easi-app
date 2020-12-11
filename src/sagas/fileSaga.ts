import axios from 'axios';
import { Action } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';

import { prepareFileUploadForApi } from 'data/files';
import { FileUploadModel } from 'types/files';
import { postFileUploadURL } from 'types/routines';

function postFileUploadURLRequest(formData: FileUploadModel) {
  const data = prepareFileUploadForApi(formData);
  return axios.post(
    `${process.env.REACT_APP_API_ADDRESS}/file_uploads/upload_url`,
    data
  );
}

function* createFileUploadURL(action: Action<any>) {
  try {
    yield put(postFileUploadURL.request());
    const response = yield call(postFileUploadURLRequest, action.payload);
    yield put(postFileUploadURL.success(response.data));
  } catch (error) {
    yield put(postFileUploadURL.failure(error.message));
  } finally {
    yield put(postFileUploadURL.fulfill());
  }
}

export default function* fileUploadSaga() {
  yield takeLatest(postFileUploadURL.TRIGGER, createFileUploadURL);
}
