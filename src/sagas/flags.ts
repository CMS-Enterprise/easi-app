import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { updateLastActiveAt } from 'reducers/authReducer';
import { fetchClientFlags } from 'types/routines';

function requestClientFlags() {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/flags`);
}

function* getClientFlags() {
  try {
    yield put(fetchClientFlags.request());
    const response = yield call(requestClientFlags);
    yield put(fetchClientFlags.success(response.data));
  } catch (error) {
    yield put(fetchClientFlags.failure(error.message));
  } finally {
    yield put(fetchClientFlags.fulfill());
    yield put(updateLastActiveAt);
  }
}

export default function* searchSaga() {
  yield takeLatest(fetchClientFlags.TRIGGER, getClientFlags);
}
