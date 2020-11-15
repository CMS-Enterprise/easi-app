import axios from 'axios';
import { DateTime } from 'luxon';
import { Action as ReduxAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';

import { updateLastActiveAt } from 'reducers/authReducer';
import { Action } from 'types/action';
import { postSystemIntakeAction } from 'types/routines';

export function postSystemIntakeActionRequest(formData: Action) {
  return axios.post(
    `${process.env.REACT_APP_API_ADDRESS}/system_intake/${formData.intakeId}/actions`,
    formData
  );
}

function* completeSystemIntake(action: ReduxAction<Action>) {
  try {
    yield put(postSystemIntakeAction.request());
    const response = yield call(postSystemIntakeActionRequest, action.payload);
    yield put(postSystemIntakeAction.success(response.data));
  } catch (error) {
    yield put(postSystemIntakeAction.failure(error.message));
  } finally {
    yield put(postSystemIntakeAction.fulfill());
    yield put(updateLastActiveAt(DateTime.local()));
  }
}

export default function* actionSaga() {
  yield takeLatest(postSystemIntakeAction.TRIGGER, completeSystemIntake);
}
