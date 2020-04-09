import axios from 'axios';
import { takeLatest, call } from 'redux-saga/effects';
import { SAVE_SYSTEM_INTAKE } from 'constants/systemIntake';

import { SystemIntakeForm, SaveSystemIntakeAction } from 'types/systemIntake';

function saveSystemIntakeRequest(formData: SystemIntakeForm) {
  // Make API save request

  return axios.put(
    `${process.env.REACT_APP_API_ADDRESS}/system_intake`,
    formData
  );
}

export function* saveSystemIntake(payload: SaveSystemIntakeAction) {
  console.log('Save System Intake Saga', payload);
  try {
    const response = yield call(saveSystemIntakeRequest, payload.formData);
    console.log('Response', response);
  } catch (err) {
    console.log(err);
  }
}

export function* systemIntakeSaga() {
  yield takeLatest(SAVE_SYSTEM_INTAKE, saveSystemIntake);
}
