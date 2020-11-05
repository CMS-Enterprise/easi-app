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
  putBusinessCase,
  storeBusinessCase
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
    case putBusinessCase.REQUEST:
      return {
        ...state,
        isSaving: true
      };
    case putBusinessCase.SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          ...prepareBusinessCaseForApp(action.payload)
        }
      };
    case putBusinessCase.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case putBusinessCase.FULFILL:
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
    case clearBusinessCase.TRIGGER:
      return initialState;
    default:
      return state;
  }
}

export default businessCaseReducer;
