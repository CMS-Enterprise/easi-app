import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { storeSystemIntakes } from 'actions/systemIntakesActions';
import { FETCH_SYSTEM_INTAKES } from 'constants/systemIntakes';

function requestSystemIntakes() {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/system_intakes`);
}

export function* fetchSystemIntakes() {
  const obj = yield call(requestSystemIntakes);
  yield put(storeSystemIntakes(obj.data));
}

export function* systemIntakesSaga() {
  yield takeLatest(FETCH_SYSTEM_INTAKES, fetchSystemIntakes);
}
