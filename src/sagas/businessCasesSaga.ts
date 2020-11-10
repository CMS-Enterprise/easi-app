import axios from 'axios';
import { DateTime } from 'luxon';
import { call, put, takeLatest } from 'redux-saga/effects';

import { updateLastActiveAt } from 'reducers/authReducer';
import { fetchBusinessCases } from 'types/routines';

function fetchBusinessCasesRequest() {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/business_cases`);
}

function* getBusinessCases() {
  try {
    yield put(fetchBusinessCases.request());
    const response = yield call(fetchBusinessCasesRequest);
    yield put(fetchBusinessCases.success(response.data));
  } catch (error) {
    yield put(fetchBusinessCases.failure(error.message));
  } finally {
    yield put(fetchBusinessCases.fulfill());
    yield put(updateLastActiveAt(DateTime.local()));
  }
}

export default function* businessCasesSaga() {
  yield takeLatest(fetchBusinessCases.TRIGGER, getBusinessCases);
}
