import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { storeSystemIntakes } from 'actions/systemIntakeActions';
import { FETCH_SYSTEM_INTAKES } from 'constants/systemIntakes';

function requestSystemIntakes(accessToken: string) {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/system_intakes`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export function* fetchSystemIntakes(action: any) {
  const obj = yield call(requestSystemIntakes, action.accessToken);
  yield put(storeSystemIntakes(obj.data));
}

export function* systemIntakesSaga() {
  yield takeLatest(FETCH_SYSTEM_INTAKES, fetchSystemIntakes);
}
