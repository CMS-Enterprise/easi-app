import { all } from 'redux-saga/effects';
import { systemIntakesSaga } from 'sagas/systemIntakesSaga';
import { searchSaga } from './searchSaga';
import { systemIntakeSaga } from './systemIntakeSaga';

export default function* rootSaga() {
  yield all([searchSaga(), systemIntakesSaga(), systemIntakeSaga()]);
}
