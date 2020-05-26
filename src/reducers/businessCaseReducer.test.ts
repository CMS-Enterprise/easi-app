import {
  businessCaseInitialData,
  prepareBusinessCaseForApp
} from 'data/businessCase';
import { fetchBusinessCase } from 'types/routines';
import businessCaseReducer from './businessCaseReducer';

describe('The business case reducer', () => {
  it('returns the initial state', () => {
    expect(businessCaseReducer(undefined, {})).toEqual({
      form: businessCaseInitialData,
      isLoading: null,
      error: null
    });
  });

  it('handles fetchBusinessCase.REQUEST', () => {
    const mockRequestAction = {
      type: fetchBusinessCase.REQUEST,
      payload: undefined
    };

    expect(businessCaseReducer(undefined, mockRequestAction)).toEqual({
      form: businessCaseInitialData,
      isLoading: true,
      error: null
    });
  });

  // TODO: Enable this test after we know the API data model
  xit('handles fetchBusinessCase.SUCCESS', () => {
    const mockBusinessCase = {};
    const mockRequestAction = {
      type: fetchBusinessCase.SUCCESS,
      payload: mockBusinessCase
    };

    expect(businessCaseReducer(undefined, mockRequestAction)).toEqual({
      form: prepareBusinessCaseForApp(mockBusinessCase),
      isLoading: true,
      error: null
    });
  });

  it('handles fetchBusinessCase.FAILURE', () => {
    const mockRequestAction = {
      type: fetchBusinessCase.FAILURE,
      payload: 'Error Found!'
    };

    expect(businessCaseReducer(undefined, mockRequestAction)).toEqual({
      form: businessCaseInitialData,
      isLoading: null,
      error: 'Error Found!'
    });
  });

  it('handles fetchBusinessCase.FULFiLL', () => {
    const mockRequestAction = {
      type: fetchBusinessCase.FULFILL,
      payload: {}
    };

    expect(businessCaseReducer(undefined, mockRequestAction)).toEqual({
      form: businessCaseInitialData,
      isLoading: false,
      error: null
    });
  });
});
