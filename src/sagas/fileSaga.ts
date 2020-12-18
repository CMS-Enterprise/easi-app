import axios from 'axios';
import { Action } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';

import { prepareFileUploadForApi } from 'data/files';
import { FileUploadForm } from 'types/files';
import { postFileUploadURL, putFileS3 } from 'types/routines';

function postFileUploadURLRequest(formData: FileUploadForm) {
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

function putFileS3Request(formData: FileUploadForm) {
  const data = new FormData();
  data.append('file', formData.file);

  return axios.put(formData.uploadURL, data);
}

function* uploadFile(action: Action<any>) {
  try {
    yield put(putFileS3.request());
    const response = yield call(putFileS3Request, action.payload);
    yield put(putFileS3.success(response.data));
  } catch (error) {
    yield put(putFileS3.failure(error.message));
  }
}

export default function* fileUploadSaga() {
  yield takeLatest(postFileUploadURL.TRIGGER, createFileUploadURL);
  yield takeLatest(putFileS3.TRIGGER, uploadFile);
}
