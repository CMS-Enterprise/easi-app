import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import {
  STORE_SYSTEM_INTAKE,
  FETCH_SYSTEM_INTAKE
} from 'constants/systemIntake';

import { SaveSystemIntakeAction } from 'types/systemIntake';
import { prepareSystemIntakeForApi } from 'data/systemIntake';
import { putSystemIntake } from '../actions/systemIntakeActions';

function saveSystemIntakeRequest({ id, formData }: SaveSystemIntakeAction) {
  // Make API save request
  const data = prepareSystemIntakeForApi(id, formData);
  return axios.put(`${process.env.REACT_APP_API_ADDRESS}/system_intake`, data);
}

export function* saveSystemIntake(payload: SaveSystemIntakeAction) {
  try {
    const response = yield call(saveSystemIntakeRequest, payload);
    console.log('Response', response);
  } catch (err) {
    console.log(err);
  }
}

function requestSystemIntake(accessToken: string, id: string) {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/system_intake/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export function* fetchSystemIntake(action: any) {
  const obj = yield call(
    requestSystemIntake,
    action.accessToken,
    action.intakeID
  );
  yield put(putSystemIntake(obj.data));
}

export function* systemIntakeSaga() {
  yield takeLatest(FETCH_SYSTEM_INTAKE, fetchSystemIntake);
  yield takeLatest(STORE_SYSTEM_INTAKE, saveSystemIntake);
}
