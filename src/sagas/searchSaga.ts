import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { GET_ALL_SYSTEM_SHORTS } from '../constants/system';
import { putSystemShorts } from '../actions/searchActions';

function requestSystemShorts() {
  return axios.get('http://localhost:8080/api/v1/systems');
}

export function* fetchAllSystemShorts() {
  const obj = yield call(requestSystemShorts);
  yield put(putSystemShorts(obj.data));
}

export function* searchSaga() {
  yield takeLatest(GET_ALL_SYSTEM_SHORTS, fetchAllSystemShorts);
}
