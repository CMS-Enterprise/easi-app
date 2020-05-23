import {
  businessCaseInitalData,
  prepareBusinessCaseForApp
} from 'data/businessCase';
import { fetchBusinessCase } from 'types/routines';
import businessCaseReducer from './businessCaseReducer';

describe('The business case reducer', () => {
  it('returns the initial state', () => {
    expect(businessCaseReducer(undefined, {})).toEqual({
      form: businessCaseInitalData,
      isLoading: null,
      isSaving: false,
      error: null
    });
  });

  it('handles fetchBusinessCase.REQUEST', () => {
    const mockRequestAction = {
      type: fetchBusinessCase.REQUEST,
      payload: undefined
    };

    expect(businessCaseReducer(undefined, mockRequestAction)).toEqual({
      form: businessCaseInitalData,
      isLoading: true,
      isSaving: false,
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
      isSaving: false,
      error: null
    });
  });

  it('handles fetchBusinessCase.FAILURE', () => {
    const mockRequestAction = {
      type: fetchBusinessCase.FAILURE,
      payload: 'Error Found!'
    };

    expect(businessCaseReducer(undefined, mockRequestAction)).toEqual({
      form: businessCaseInitalData,
      isLoading: null,
      isSaving: false,
      error: 'Error Found!'
    });
  });

  it('handles fetchBusinessCase.FULFiLL', () => {
    const mockRequestAction = {
      type: fetchBusinessCase.FULFILL,
      payload: {}
    };

    expect(businessCaseReducer(undefined, mockRequestAction)).toEqual({
      form: businessCaseInitalData,
      isLoading: false,
      isSaving: false,
      error: null
    });
  });
});
