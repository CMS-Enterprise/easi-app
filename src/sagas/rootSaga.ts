import { all } from 'redux-saga/effects';
import { systemIntakesSaga } from 'sagas/systemIntakesSaga';
import { searchSaga } from './searchSaga';

export default function* rootSaga() {
  yield all([searchSaga(), systemIntakesSaga()]);
}
