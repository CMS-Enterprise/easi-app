import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { PUT_SYSTEM_INTAKE } from 'constants/actions';

import { PutSystemIntakeAction } from 'types/systemIntake';
import { prepareSystemIntakeForApi } from 'data/systemIntake';
import { fetchSystemIntake } from 'types/routines';
import { Action } from 'redux-actions';

function putSystemIntakeRequest({ formData }: PutSystemIntakeAction) {
  // Make API save request
  const data = prepareSystemIntakeForApi(formData);
  return axios.put(`${process.env.REACT_APP_API_ADDRESS}/system_intake`, data);
}

export function* putSystemIntake(payload: PutSystemIntakeAction) {
  try {
    const response = yield call(putSystemIntakeRequest, payload);
    // eslint-disable-next-line no-console
    console.log('Response', response);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

function getSystemIntakeRequest(id: string) {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/system_intake/${id}`);
}

function* getSystemIntake(action: Action<any>) {
  try {
    yield put(fetchSystemIntake.request());
    const response = yield call(getSystemIntakeRequest, action.payload);
    yield put(fetchSystemIntake.success(response.data));
  } catch (error) {
    yield put(fetchSystemIntake.failure(error.message));
  } finally {
    yield put(fetchSystemIntake.fulfill());
  }
}

export function* systemIntakeSaga() {
  yield takeLatest(fetchSystemIntake.TRIGGER, getSystemIntake);
  yield takeLatest(PUT_SYSTEM_INTAKE, putSystemIntake);
}
