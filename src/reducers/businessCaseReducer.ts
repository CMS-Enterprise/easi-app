import { BusinessCaseState } from 'types/businessCase';
import {
  businessCaseInitalData,
  prepareBusinessCaseForApp
} from 'data/businessCase';
import {
  fetchBusinessCase,
  postBusinessCase,
  storeBusinessCase
} from 'types/routines';
import { Action } from 'redux-actions';

const initialState: BusinessCaseState = {
  form: businessCaseInitalData,
  isLoading: null,
  isSaving: false,
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
    default:
      return state;
  }
}

export default businessCaseReducer;
// TODO ADD TESTS! THAT WAS NEXT
