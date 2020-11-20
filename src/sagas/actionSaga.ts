import axios from 'axios';
import { DateTime } from 'luxon';
import { Action as ReduxAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';

import { updateLastActiveAt } from 'reducers/authReducer';
import { Action } from 'types/action';
import { fetchActions, postAction } from 'types/routines';

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
    yield put(updateLastActiveAt(DateTime.local()));
  }
}

function getActionsRequest(intakeId: string) {
  return axios.get(
    `${process.env.REACT_APP_API_ADDRESS}/system_intake/${intakeId}/actions`
  );
}

function* getActions(action: ReduxAction<any>) {
  try {
    yield put(fetchActions.request());
    const response = yield call(getActionsRequest, action.payload);
    yield put(fetchActions.success(response.data));
  } catch (error) {
    yield put(fetchActions.failure(error.message));
  } finally {
    yield put(fetchActions.fulfill());
    yield put(updateLastActiveAt(DateTime.local()));
  }
}

export default function* actionSaga() {
  yield takeLatest(postAction.TRIGGER, completeSystemIntake);
  yield takeLatest(fetchActions.TRIGGER, getActions);
}
