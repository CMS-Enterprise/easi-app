import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { PUT_SYSTEM_INTAKE, GET_SYSTEM_INTAKE } from 'constants/actions';

import { PutSystemIntakeAction } from 'types/systemIntake';
import { prepareSystemIntakeForApi } from 'data/systemIntake';
import { storeSystemIntake } from 'actions/systemIntakeActions';

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

function getSystemIntake(id: string) {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/system_intake/${id}`);
}

export function* getAndStoreSystemIntake(action: any) {
  const obj = yield call(getSystemIntake, action.intakeID);
  yield put(storeSystemIntake(obj.data));
}

export function* systemIntakeSaga() {
  yield takeLatest(GET_SYSTEM_INTAKE, getAndStoreSystemIntake);
  yield takeLatest(PUT_SYSTEM_INTAKE, putSystemIntake);
}
