import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { fetchSystemIntakes } from 'routines/routines';

function getSystemIntakesRequest() {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/system_intakes`);
}

export function* getSystemIntakes() {
  try {
    yield put(fetchSystemIntakes.request());
    const response = yield call(getSystemIntakesRequest);
    yield put(fetchSystemIntakes.success(response.data));
  } catch (error) {
    yield put(fetchSystemIntakes.failure(error.message));
  } finally {
    yield put(fetchSystemIntakes.fulfill());
  }
}

export function* systemIntakesSaga() {
  yield takeLatest(fetchSystemIntakes.TRIGGER, getSystemIntakes);
}
