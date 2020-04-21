import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { storeSystemIntakes } from 'actions/systemIntakesActions';
import { GET_SYSTEM_INTAKES } from 'constants/actions';

function getSystemIntakesRequest() {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/system_intakes`);
}

export function* getSystemIntakes() {
  const obj = yield call(getSystemIntakesRequest);
  yield put(storeSystemIntakes(obj.data));
}

export function* systemIntakesSaga() {
  yield takeLatest(GET_SYSTEM_INTAKES, getSystemIntakes);
}
