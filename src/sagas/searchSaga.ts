import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { GET_ALL_SYSTEM_SHORTS } from '../constants/actions';
import { storeSystemShorts } from '../actions/searchActions';

function requestSystemShorts() {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/systems`);
}

export function* fetchAllSystemShorts() {
  const obj = yield call(requestSystemShorts);
  yield put(storeSystemShorts(obj.data));
}

export function* searchSaga() {
  yield takeLatest(GET_ALL_SYSTEM_SHORTS, fetchAllSystemShorts);
}
