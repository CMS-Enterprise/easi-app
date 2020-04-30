import { BusinessCaseState } from 'types/businessCase';
import {
  businessCaseInitalData,
  prepareBusinessCaseForApp
} from 'data/businessCase';
import { fetchBusinessCase } from 'types/routines';
import { Action } from 'redux-actions';

const initialState: BusinessCaseState = {
  form: businessCaseInitalData,
  isLoading: null,
  error: null
};

function systemIntakeReducer(
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
        error: action.error
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

export default systemIntakeReducer;
