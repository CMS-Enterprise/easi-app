import { Action } from 'redux-actions';

import {
  businessCaseInitialData,
  prepareBusinessCaseForApp
} from 'data/businessCase';
import { BusinessCaseState } from 'types/businessCase';
import {
  clearBusinessCase,
  fetchBusinessCase,
  postBusinessCase,
  storeBusinessCase,
  submitBusinessCase
} from 'types/routines';

const initialState: BusinessCaseState = {
  form: businessCaseInitialData,
  isLoading: null,
  isSaving: false,
  isSubmitting: false,
  error: null
};

function businessCaseReducer(
  state = initialState,
  action: Action<any>
): BusinessCaseState {
  switch (action.type) {
    case fetchBusinessCase.REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case fetchBusinessCase.SUCCESS:
      return {
        ...state,
        form: prepareBusinessCaseForApp(action.payload)
      };
    case fetchBusinessCase.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case fetchBusinessCase.FULFILL:
      return {
        ...state,
        isLoading: false
      };
    case postBusinessCase.REQUEST:
      return {
        ...state,
        isSaving: true
      };
    case postBusinessCase.SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          ...prepareBusinessCaseForApp(action.payload)
        }
      };
    case postBusinessCase.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case postBusinessCase.FULFILL:
      return {
        ...state,
        isSaving: false
      };
    case storeBusinessCase.TRIGGER:
      return {
        ...state,
        form: {
          ...state.form,
          ...action.payload
        },
        isLoading: false
      };
    case submitBusinessCase.REQUEST:
      return {
        ...state,
        isSubmitting: true,
        error: null
      };
    case submitBusinessCase.SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          ...prepareBusinessCaseForApp(action.payload)
        }
      };
    case submitBusinessCase.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case submitBusinessCase.FULFILL:
      return {
        ...state,
        isSubmitting: false
      };
    case clearBusinessCase.TRIGGER:
      return initialState;
    default:
      return state;
  }
}

export default businessCaseReducer;
