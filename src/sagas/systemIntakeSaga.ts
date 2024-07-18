import axios from 'axios';
import { Action } from 'redux-actions';
import { call, put, StrictEffect, takeLatest } from 'redux-saga/effects';

import { archiveSystemIntake } from 'types/routines';

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
  yield takeLatest(archiveSystemIntake.TRIGGER, deleteSystemIntake);
}
