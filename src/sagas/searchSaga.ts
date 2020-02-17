import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { GET_ALL_SYSTEM_SHORTS } from '../constants/search';
import { putSystemShorts } from '../actions/searchActions';

function requestSystemShorts(accessToken: string) {
  return axios.get('http://localhost:8080/systems', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export function* fetchAllSystemShorts(action: any) {
  const obj = yield call(requestSystemShorts, action.payload);
  yield put(putSystemShorts(obj));
}

export function* searchSaga() {
  yield takeLatest(GET_ALL_SYSTEM_SHORTS, fetchAllSystemShorts);
}
