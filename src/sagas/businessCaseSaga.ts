import axios from 'axios';
import { Action } from 'redux-actions';
import { call, put, StrictEffect, takeLatest } from 'redux-saga/effects';

import { prepareBusinessCaseForApi } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import {
  fetchBusinessCase,
  postBusinessCase,
  putBusinessCase
} from 'types/routines';
import getWindowAddress from 'utils/host';

// Pull the API address from the vite environment variables
// However, if we don't have a VITE_API_ADDRESS, we should simply assume that the API is hosted on the same domain & port as the frontend
// We also assume a path of /api/v1 should be tacked onto that
const apiAddress =
  import.meta.env.VITE_API_ADDRESS || `${getWindowAddress()}/api/v1`;

function getBusinessCaseRequest(id: string) {
  return axios.get(`${apiAddress}/business_case/${id}`);
}

function* getBusinessCase(
  action: Action<any>
): Generator<StrictEffect, any, { data: any }> {
  try {
    yield put(fetchBusinessCase.request());
    const response = yield call(getBusinessCaseRequest, action.payload);
    yield put(fetchBusinessCase.success(response.data));
  } catch (error: any) {
    yield put(fetchBusinessCase.failure(error.message));
  } finally {
    yield put(fetchBusinessCase.fulfill());
  }
}

function postBusinessCaseRequest(formData: BusinessCaseModel) {
  const data = prepareBusinessCaseForApi(formData);
  return axios.post(`${apiAddress}/business_case`, data);
}

function* createBusinessCase(
  action: Action<any>
): Generator<StrictEffect, any, { data: any }> {
  try {
    yield put(postBusinessCase.request());
    const response = yield call(postBusinessCaseRequest, action.payload);
    yield put(postBusinessCase.success(response.data));
  } catch (error: any) {
    yield put(postBusinessCase.failure(error.message));
  } finally {
    yield put(postBusinessCase.fulfill());
  }
}

function putBusinessCaseRequest(formData: BusinessCaseModel) {
  const data = prepareBusinessCaseForApi(formData);
  return axios.put(`${apiAddress}/business_case/${data.id}`, data);
}

function* updateBusinessCase(
  action: Action<any>
): Generator<StrictEffect, any, { data: any }> {
  try {
    yield put(putBusinessCase.request(action.payload));
    const reponse = yield call(putBusinessCaseRequest, action.payload);

    yield put(putBusinessCase.success(reponse.data));
  } catch (error: any) {
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
