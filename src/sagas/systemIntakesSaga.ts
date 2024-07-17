import axios from 'axios';
import { Action } from 'redux-actions';
import { call, put, StrictEffect, takeLatest } from 'redux-saga/effects';

import { fetchSystemIntakes } from 'types/routines';

function getSystemIntakesRequest(status: string | null) {
  let route = `${import.meta.env.VITE_API_ADDRESS}/system_intakes`;
  if (status) {
    route = `${route}?status=${status}`;
  }
  return axios.get(route);
}

function* getSystemIntakes(
  action: Action<any>
): Generator<StrictEffect, any, { data: any }> {
  const { payload } = action;
  const status = payload && payload.status;
  try {
    console.info('hello!');
    yield put(fetchSystemIntakes.request());
    const response = yield call(getSystemIntakesRequest, status);
    yield put(fetchSystemIntakes.success(response.data));
  } catch (error: any) {
    yield put(fetchSystemIntakes.failure(error.message));
  } finally {
    yield put(fetchSystemIntakes.fulfill());
  }
}

export default function* systemIntakesSaga() {
  yield takeLatest(fetchSystemIntakes.TRIGGER, getSystemIntakes);
}
