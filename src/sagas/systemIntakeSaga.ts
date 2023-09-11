import axios from 'axios';
import { Action } from 'redux-actions';
import { call, put, StrictEffect, takeLatest } from 'redux-saga/effects';

import { prepareSystemIntakeForApi } from 'data/systemIntake';
import {
  archiveSystemIntake,
  fetchSystemIntake,
  saveSystemIntake
} from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';

function putSystemIntakeRequest(formData: SystemIntakeForm) {
  // Make API save request
  const data = prepareSystemIntakeForApi(formData);
  return axios.put(`${import.meta.env.VITE_API_ADDRESS}/system_intake`, data);
}

function* putSystemIntake(
  action: Action<any>
): Generator<StrictEffect, any, { data: any }> {
  try {
    yield put(saveSystemIntake.request(action.payload));
    const response = yield call(putSystemIntakeRequest, action.payload);
    yield put(saveSystemIntake.success(response.data));
  } catch (error: any) {
    yield put(saveSystemIntake.failure(error.message));
  } finally {
    yield put(saveSystemIntake.fulfill());
  }
}

function getSystemIntakeRequest(id: string) {
  return axios.get(`${import.meta.env.VITE_API_ADDRESS}/system_intake/${id}`);
}

function* getSystemIntake(
  action: Action<any>
): Generator<StrictEffect, any, { data: any }> {
  try {
    yield put(fetchSystemIntake.request());
    const response = yield call(getSystemIntakeRequest, action.payload);
    yield put(fetchSystemIntake.success(response.data));
  } catch (error: any) {
    yield put(fetchSystemIntake.failure(error.message));
  } finally {
    yield put(fetchSystemIntake.fulfill());
  }
}

function deleteSystemIntakeRequest(id: string) {
  return axios.delete(
    `${import.meta.env.VITE_API_ADDRESS}/system_intake/${id}`
  );
}

function* deleteSystemIntake(
  action: Action<any>
): Generator<StrictEffect, any, { data: any }> {
  try {
    yield put(archiveSystemIntake.request());
    const response = yield call(
      deleteSystemIntakeRequest,
      action.payload.intakeId
    );
    yield put(archiveSystemIntake.success(response.data));
    action.payload.redirect();
  } catch (error: any) {
    yield put(archiveSystemIntake.failure(error.message));
  } finally {
    yield put(archiveSystemIntake.fulfill());
  }
}

export default function* systemIntakeSaga() {
  yield takeLatest(fetchSystemIntake.TRIGGER, getSystemIntake);
  yield takeLatest(saveSystemIntake.TRIGGER, putSystemIntake);
  yield takeLatest(archiveSystemIntake.TRIGGER, deleteSystemIntake);
}
