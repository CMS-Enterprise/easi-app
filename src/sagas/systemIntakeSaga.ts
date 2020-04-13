import axios from 'axios';
import { takeLatest, call } from 'redux-saga/effects';
import { PUT_SYSTEM_INTAKE } from 'constants/systemIntake';

import { SaveSystemIntakeAction } from 'types/systemIntake';
import { prepareSystemIntakeForApi } from 'data/systemIntake';

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

export function* systemIntakeSaga() {
  yield takeLatest(PUT_SYSTEM_INTAKE, saveSystemIntake);
}
