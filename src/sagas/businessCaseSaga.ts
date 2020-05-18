import axios from 'axios';
import { takeLatest, call, put } from 'redux-saga/effects';
import { fetchBusinessCase } from 'types/routines';
import { Action } from 'redux-actions';

function getBusinessCaseRequest(id: string) {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/business_case/${id}`);
}

function* getBusinessCase(action: Action<any>) {
  try {
    yield put(fetchBusinessCase.request());
    // TODO: Probably have to prepare this data to be sent
    const response = yield call(getBusinessCaseRequest, action.payload);
    yield put(fetchBusinessCase.success(response.data));
  } catch (error) {
    yield put(fetchBusinessCase.failure(error.message));
  } finally {
    yield put(fetchBusinessCase.fulfill());
  }
}

export default function* businessCaseSaga() {
  yield takeLatest(fetchBusinessCase.TRIGGER, getBusinessCase);
}
