import { prepareBusinessCaseForApp } from 'data/businessCase';
import { fetchBusinessCases } from 'types/routines';

import businessCasesReducer from './businessCasesReducer';

describe('The business cases reducer', () => {
  it('returns the initial state', () => {
    expect(businessCasesReducer(undefined, {})).toEqual({
      businessCases: [],
      error: null,
      isLoading: null,
      loadedTimestamp: null
    });
  });

  it('handles fetchBusinessCases.REQUEST', () => {
    const mockRequestAction = {
      type: fetchBusinessCases.REQUEST,
      payload: undefined
    };

    expect(businessCasesReducer(undefined, mockRequestAction)).toEqual({
      businessCases: [],
      error: null,
      isLoading: true,
      loadedTimestamp: null
    });
  });

  xit('handles fetchBusinessCases.SUCCESS', () => {
    const mockApiBusinessCase = {};
    const mockSuccessAction = {
      type: fetchBusinessCases.SUCCESS,
      payload: [mockApiBusinessCase]
    };

    expect(
      businessCasesReducer(undefined, mockSuccessAction).businessCases
    ).toMatchObject([prepareBusinessCaseForApp(mockApiBusinessCase)]);
  });

  it('handles fetchBusinessCases.FAILURE', () => {
    const mockFailureAction = {
      type: fetchBusinessCases.FAILURE,
      payload: 'Error'
    };

    expect(businessCasesReducer(undefined, mockFailureAction)).toEqual({
      businessCases: [],
      error: 'Error',
      isLoading: null,
      loadedTimestamp: null
    });
  });

  it('handles fetchBusinessCases.FULFILL', () => {
    const mockFulfillAction = {
      type: fetchBusinessCases.FULFILL,
      payload: undefined
    };

    expect(businessCasesReducer(undefined, mockFulfillAction)).toEqual({
      businessCases: [],
      error: null,
      isLoading: false,
      loadedTimestamp: null
    });
  });
});
