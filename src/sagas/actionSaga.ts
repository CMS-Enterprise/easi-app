import axios from 'axios';
import { Action as ReduxAction } from 'redux-actions';
import { call, put, StrictEffect, takeLatest } from 'redux-saga/effects';

import { Action } from 'types/action';
import { postAction } from 'types/routines';
import getWindowAddress from 'utils/host';

// Pull the API address from the vite environment variables
// However, if we don't have a VITE_API_ADDRESS, we should simply assume that the API is hosted on the same domain & port as the frontend
// We also assume a path of /api/v1 should be tacked onto that
const apiAddress =
  import.meta.env.VITE_API_ADDRESS || `${getWindowAddress()}/api/v1`;

export function postSystemIntakeActionRequest(formData: Action) {
  return axios.post(
    `${apiAddress}/system_intake/${formData.intakeId}/actions`,
    formData
  );
}

function* completeSystemIntake(
  action: ReduxAction<Action>
): Generator<StrictEffect, any, { data: any }> {
  try {
    yield put(postAction.request());
    const response = yield call(postSystemIntakeActionRequest, action.payload);
    yield put(postAction.success(response.data));
  } catch (error: any) {
    yield put(postAction.failure(error.message));
  } finally {
    yield put(postAction.fulfill());
  }
}

export default function* actionSaga() {
  yield takeLatest(postAction.TRIGGER, completeSystemIntake);
}
