import { all } from 'redux-saga/effects';
import systemIntakesSaga from 'sagas/systemIntakesSaga';
import searchSaga from 'sagas/searchSaga';
import systemIntakeSaga from 'sagas/systemIntakeSaga';
import businessCaseSaga from 'sagas/businessCaseSaga';

export default function* rootSaga() {
  yield all([
    searchSaga(),
    systemIntakesSaga(),
    systemIntakeSaga(),
    businessCaseSaga()
  ]);
}
