import { all } from 'redux-saga/effects';
import { searchSaga } from './searchSaga';
import { systemIntakeSaga } from './systemIntakeSaga';

export default function* rootSaga() {
  yield all([searchSaga(), systemIntakeSaga()]);
}
