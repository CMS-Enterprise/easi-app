import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { updateLastActiveAt } from 'reducers/authReducer';
import { fetchRequestRepoIntakes } from 'types/routines';

function fetchRequestRepos() {
  // TODO: Need to get correct endpoint
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/grt/intakes`);
}
function* getRequestRepoIntakes() {
  try {
    yield put(fetchRequestRepoIntakes.request());
    const response = yield call(fetchRequestRepos);
    yield put(fetchRequestRepoIntakes.success(response.data));
    yield put(updateLastActiveAt);
  } catch (error) {
    yield put(fetchRequestRepoIntakes.failure(error.message));
  } finally {
    yield put(fetchRequestRepoIntakes.fulfill());
  }
}

export default function* requestRepositorySaga() {
  yield takeLatest(fetchRequestRepoIntakes.TRIGGER, getRequestRepoIntakes);
}
