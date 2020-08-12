import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { updateLastActiveAt } from 'reducers/authReducer';
import { fetchSystemIntakes } from 'types/routines';

function getSystemIntakesRequest() {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/system_intakes`);
}

function* getSystemIntakes() {
  try {
    yield put(fetchSystemIntakes.request());
    const response = yield call(getSystemIntakesRequest);
    yield put(fetchSystemIntakes.success(response.data));
  } catch (error) {
    yield put(fetchSystemIntakes.failure(error.message));
  } finally {
    yield put(fetchSystemIntakes.fulfill());
    yield put(updateLastActiveAt);
  }
}

export default function* systemIntakesSaga() {
  yield takeLatest(fetchSystemIntakes.TRIGGER, getSystemIntakes);
}
