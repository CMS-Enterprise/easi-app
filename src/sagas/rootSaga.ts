import { all } from 'redux-saga/effects';

import actionSaga from 'sagas/actionSaga';
import businessCaseSaga from 'sagas/businessCaseSaga';
import systemIntakeSaga from 'sagas/systemIntakeSaga';

export default function* rootSaga() {
  yield all([systemIntakeSaga(), businessCaseSaga(), actionSaga()]);
}
