import axios from 'axios';
import { Action } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';

import { prepareFileUploadForApi } from 'data/files';
import { FileUploadForm } from 'types/files';
import { getFileS3, postFileUploadURL, putFileS3 } from 'types/routines';

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
    yield put(
      postFileUploadURL.success({ ...action.payload, ...response.data })
    );
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
    yield call(putFileS3Request, action.payload);
    // S3 doesn't return anything besides success
    yield put(putFileS3.success(action.payload));
  } catch (error) {
    yield put(putFileS3.failure(error.message));
  }
}

function postFileDownloadURLRequest(file: any) {
  return axios.post(
    `${process.env.REACT_APP_API_ADDRESS}/file_uploads/${file.filename}/download_url`
  );
}

function* downloadFile(action: Action<any>) {
  try {
    yield put(getFileS3.request());
    const response = yield call(postFileDownloadURLRequest, action.payload);
    yield put(getFileS3.success(response.data));

    const url = window.URL.createObjectURL(new Blob([response.data.URL]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${response.data.filename}`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    yield put(getFileS3.failure(error.message));
  } finally {
    yield put(getFileS3.fulfill());
  }
}

export default function* fileUploadSaga() {
  yield takeLatest(postFileUploadURL.TRIGGER, createFileUploadURL);
  yield takeLatest(putFileS3.TRIGGER, uploadFile);
  yield takeLatest(getFileS3.TRIGGER, downloadFile);
}
