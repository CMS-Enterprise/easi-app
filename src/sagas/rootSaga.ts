import { all } from 'redux-saga/effects';

import actionSaga from 'sagas/actionSaga';
import businessCaseSaga from 'sagas/businessCaseSaga';

export default function* rootSaga() {
  yield all([businessCaseSaga(), actionSaga()]);
}
