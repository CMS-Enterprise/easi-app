import { BusinessCaseState } from 'types/businessCase';
import {
  businessCaseInitialData,
  prepareBusinessCaseForApp
} from 'data/businessCase';
import { fetchBusinessCase } from 'types/routines';
import { Action } from 'redux-actions';

const initialState: BusinessCaseState = {
  form: businessCaseInitialData,
  isLoading: null,
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
    default:
      return state;
  }
}

export default businessCaseReducer;
