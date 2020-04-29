import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { PutSystemIntakeAction } from 'types/systemIntake';
import { prepareSystemIntakeForApi } from 'data/systemIntake';
import { fetchSystemIntake, saveSystemIntake } from 'types/routines';
import { Action } from 'redux-actions';
import { Routine } from 'redux-saga-routines';

function putSystemIntakeRequest({ id, formData }: PutSystemIntakeAction) {
  // Make API save request
  const data = prepareSystemIntakeForApi(id, formData);
  return axios.put(`${process.env.REACT_APP_API_ADDRESS}/system_intake`, data);
}

function createRoutineSaga(routine: Routine, requestFunction: any) {
  // eslint-disable-next-line func-names
  return function*(action: Action<any>) {
    try {
      yield put(routine.request());
      const response = yield call(requestFunction, action.payload);
      yield put(routine.success(response.data));
    } catch (error) {
      yield put(routine.failure(error.message));
    } finally {
      yield put(routine.fulfill());
    }
  };
}

function getSystemIntakeRequest(id: string) {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/system_intake/${id}`);
}

export default function* systemIntakeSaga() {
  yield takeLatest(
    fetchSystemIntake.TRIGGER,
    createRoutineSaga(fetchSystemIntake, getSystemIntakeRequest)
  );
  yield takeLatest(
    saveSystemIntake.TRIGGER,
    createRoutineSaga(saveSystemIntake, putSystemIntakeRequest)
  );
}
