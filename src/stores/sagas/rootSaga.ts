import { all } from 'redux-saga/effects';
import actionSaga from 'stores/sagas/actionSaga';
import businessCaseSaga from 'stores/sagas/businessCaseSaga';

export default function* rootSaga() {
  yield all([businessCaseSaga(), actionSaga()]);
}
