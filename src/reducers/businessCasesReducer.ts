import { DateTime } from 'luxon';
import { Action } from 'redux-actions';

import { prepareBusinessCaseForApp } from 'data/businessCase';
import { BusinessCasesState } from 'types/businessCase';
import { fetchBusinessCases } from 'types/routines';

const initialState: BusinessCasesState = {
  businessCases: [],
  isLoading: null,
  loadedTimestamp: null,
  error: null
};

function businessCasesReducer(
  state = initialState,
  action: Action<any>
): BusinessCasesState {
  switch (action.type) {
    case fetchBusinessCases.REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case fetchBusinessCases.SUCCESS:
      return {
        ...state,
        businessCases: action.payload.map((businessCase: any) =>
          prepareBusinessCaseForApp(businessCase)
        ),
        loadedTimestamp: DateTime.local()
      };
    case fetchBusinessCases.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case fetchBusinessCases.FULFILL:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

export default businessCasesReducer;
