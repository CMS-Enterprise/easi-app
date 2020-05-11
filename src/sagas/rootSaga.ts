import { all } from 'redux-saga/effects';
import systemIntakesSaga from 'sagas/systemIntakesSaga';
import searchSaga from 'sagas/searchSaga';
import systemIntakeSaga from 'sagas/systemIntakeSaga';

export default function* rootSaga() {
  yield all([searchSaga(), systemIntakesSaga(), systemIntakeSaga()]);
}
