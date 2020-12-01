import { all } from 'redux-saga/effects';

import actionSaga from 'sagas/actionSaga';
import businessCaseSaga from 'sagas/businessCaseSaga';
import businessCasesSaga from 'sagas/businessCasesSaga';
import searchSaga from 'sagas/searchSaga';
import systemIntakeSaga from 'sagas/systemIntakeSaga';
import systemIntakesSaga from 'sagas/systemIntakesSaga';

export default function* rootSaga() {
  yield all([
    searchSaga(),
    systemIntakesSaga(),
    systemIntakeSaga(),
    businessCaseSaga(),
    businessCasesSaga(),
    actionSaga()
  ]);
}
