import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { updateLastActiveAt } from 'reducers/authReducer';
import { fetchSystemShorts } from 'types/routines';

function requestSystemShorts() {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/systems`);
}

function* getSystemShorts() {
  try {
    yield put(fetchSystemShorts.request());
    const response = yield call(requestSystemShorts);
    yield put(fetchSystemShorts.success(response.data));
  } catch (error) {
    yield put(fetchSystemShorts.failure(error.message));
  } finally {
    yield put(fetchSystemShorts.fulfill());
    yield put(updateLastActiveAt);
  }
}

export default function* searchSaga() {
  yield takeLatest(fetchSystemShorts.TRIGGER, getSystemShorts);
}
