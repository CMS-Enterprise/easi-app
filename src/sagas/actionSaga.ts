import axios from 'axios';
import { Action as ReduxAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';

import { Action } from 'types/action';
import { postAction } from 'types/routines';

export function postSystemIntakeActionRequest(formData: Action) {
  return axios.post(
    `${process.env.REACT_APP_API_ADDRESS}/system_intake/${formData.intakeId}/actions`,
    formData
  );
}

function* completeSystemIntake(action: ReduxAction<Action>) {
  try {
    yield put(postAction.request());
    const response = yield call(postSystemIntakeActionRequest, action.payload);
    yield put(postAction.success(response.data));
  } catch (error) {
    yield put(postAction.failure(error.message));
  } finally {
    yield put(postAction.fulfill());
  }
}

export default function* actionSaga() {
  yield takeLatest(postAction.TRIGGER, completeSystemIntake);
}
