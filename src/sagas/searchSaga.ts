import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
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
  }
}

export default function* searchSaga() {
  yield takeLatest(fetchSystemShorts.TRIGGER, getSystemShorts);
}
