import { takeLatest } from 'redux-saga/effects';
import { GET_ALL_SYSTEM_SHORTS } from '../constants/search';

// eslint-disable-next-line require-yield
export function* fetchAllSystemShorts() {
  console.log('fetching all systems');
}

export function* searchSaga() {
  yield takeLatest(GET_ALL_SYSTEM_SHORTS, fetchAllSystemShorts);
}
