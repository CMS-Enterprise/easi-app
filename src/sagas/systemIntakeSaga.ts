import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { SystemIntakeForm } from 'types/systemIntake';
import { prepareSystemIntakeForApi } from 'data/systemIntake';
import {
  fetchSystemIntake,
  saveSystemIntake,
  submitSystemIntake
} from 'types/routines';
import { Action } from 'redux-actions';

function putSystemIntakeRequest(formData: SystemIntakeForm) {
  // Make API save request
  const data = prepareSystemIntakeForApi(formData);
  return axios.put(`${process.env.REACT_APP_API_ADDRESS}/system_intake`, data);
}

function* putSystemIntake(action: Action<any>) {
  try {
    yield put(saveSystemIntake.request());
    const response = yield call(putSystemIntakeRequest, action.payload);
    yield put(saveSystemIntake.success(response.data));
  } catch (error) {
    yield put(saveSystemIntake.failure(error.message));
  } finally {
    yield put(saveSystemIntake.fulfill());
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

function* completeSystemIntake(action: Action<any>) {
  try {
    yield put(submitSystemIntake.request());
    const response = yield call(putSystemIntakeRequest, {
      ...action.payload,
      status: 'SUBMITTED'
    });
    yield put(submitSystemIntake.success(response.data));
  } catch (error) {
    yield put(submitSystemIntake.failure(error.message));
  } finally {
    yield put(submitSystemIntake.fulfill());
  }
}

export default function* systemIntakeSaga() {
  yield takeLatest(fetchSystemIntake.TRIGGER, getSystemIntake);
  yield takeLatest(saveSystemIntake.TRIGGER, putSystemIntake);
  yield takeLatest(submitSystemIntake.TRIGGER, completeSystemIntake);
}
