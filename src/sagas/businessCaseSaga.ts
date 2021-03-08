import axios from 'axios';
import { Action } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';

import { prepareBusinessCaseForApi } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import {
  fetchBusinessCase,
  postBusinessCase,
  putBusinessCase
} from 'types/routines';

function getBusinessCaseRequest(id: string) {
  return axios.get(`${process.env.REACT_APP_API_ADDRESS}/business_case/${id}`);
}

function* getBusinessCase(action: Action<any>) {
  try {
    yield put(fetchBusinessCase.request());
    const response = yield call(getBusinessCaseRequest, action.payload);
    yield put(fetchBusinessCase.success(response.data));
  } catch (error) {
    yield put(fetchBusinessCase.failure(error.message));
  } finally {
    yield put(fetchBusinessCase.fulfill());
  }
}

function postBusinessCaseRequest(formData: BusinessCaseModel) {
  const data = prepareBusinessCaseForApi(formData);
  return axios.post(`${process.env.REACT_APP_API_ADDRESS}/business_case`, data);
}

function* createBusinessCase(action: Action<any>) {
  try {
    yield put(postBusinessCase.request());
    const response = yield call(postBusinessCaseRequest, action.payload);
    yield put(postBusinessCase.success(response.data));
  } catch (error) {
    yield put(postBusinessCase.failure(error.message));
  } finally {
    yield put(postBusinessCase.fulfill());
  }
}

function putBusinessCaseRequest(formData: BusinessCaseModel) {
  const data = prepareBusinessCaseForApi(formData);
  return axios.put(
    `${process.env.REACT_APP_API_ADDRESS}/business_case/${data.id}`,
    data
  );
}

function* updateBusinessCase(action: Action<any>) {
  try {
    yield put(putBusinessCase.request(action.payload));
    const reponse = yield call(putBusinessCaseRequest, action.payload);

    yield put(putBusinessCase.success(reponse.data));
  } catch (error) {
    yield put(putBusinessCase.failure(error.message));
  } finally {
    yield put(putBusinessCase.fulfill());
  }
}

export default function* businessCaseSaga() {
  yield takeLatest(fetchBusinessCase.TRIGGER, getBusinessCase);
  yield takeLatest(postBusinessCase.TRIGGER, createBusinessCase);
  yield takeLatest(putBusinessCase.TRIGGER, updateBusinessCase);
}
