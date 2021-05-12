import {
  businessCaseInitialData,
  prepareBusinessCaseForApp
} from 'data/businessCase';
import {
  clearBusinessCase,
  fetchBusinessCase,
  postBusinessCase,
  putBusinessCase
} from 'types/routines';

import businessCaseReducer from './businessCaseReducer';

describe('The business case reducer', () => {
  it('returns the initial state', () => {
    expect(businessCaseReducer(undefined, {})).toEqual({
      form: businessCaseInitialData,
      isLoading: null,
      isSaving: false,
      error: null
    });
  });

  describe('fetchBusinessCase', () => {
    it('handles fetchBusinessCase.REQUEST', () => {
      const mockRequestAction = {
        type: fetchBusinessCase.REQUEST,
        payload: undefined
      };

      expect(businessCaseReducer(undefined, mockRequestAction)).toEqual({
        form: businessCaseInitialData,
        isLoading: true,
        isSaving: false,
        error: null
      });
    });

    it('handles fetchBusinessCase.SUCCESS', () => {
      const mockBusinessCase = {
        id: 'c8e9fe76-e9bc-4a0c-b5c3-29b7bfa856d7',
        euaUserId: 'ABCD',
        systemIntake: 'a84f7cc3-75e1-4686-aaac-68af95455ae8',
        status: 'OPEN',
        projectName: 'Easy Access to System Information',
        requester: 'Tom Foolery',
        requesterPhoneNumber: '1234567890',
        businessOwner: 'Jackie Moss',
        businessNeed: 'Test Business Need',
        cmsBenefit: 'CMS Benefit',
        priorityAlignment: 'Mah Priorities',
        successIndicators: 'Im successful',
        asIsTitle: '',
        asIsSummary: '',
        asIsPros: '',
        asIsCons: '',
        asIsCostSavings: '',
        preferredTitle: '',
        preferredSummary: '',
        preferredAcquisitionApproach: '',
        preferredPros: '',
        preferredCons: '',
        preferredCostSavings: '',
        alternativeATitle: '',
        alternativeASummary: '',
        alternativeAAcquisitionApproach: '',
        alternativeAPros: '',
        alternativeACons: '',
        alternativeACostSavings: '',
        alternativeBTitle: null,
        alternativeBSummary: null,
        alternativeBAcquisitionApproach: null,
        alternativeBPros: null,
        alternativeBCons: null,
        alternativeBCostSavings: null,
        lifecycleCostLines: [],
        createdAt: '2020-05-22T23:42:18.626594-07:00',
        updatedAt: '2020-05-22T23:42:18.626594-07:00'
      };
      const mockRequestAction = {
        type: fetchBusinessCase.SUCCESS,
        payload: mockBusinessCase
      };

      expect(businessCaseReducer(undefined, mockRequestAction)).toEqual({
        form: prepareBusinessCaseForApp(mockBusinessCase),
        isLoading: null,
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
        form: businessCaseInitialData,
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
        form: businessCaseInitialData,
        isLoading: false,
        isSaving: false,
        error: null
      });
    });
  });

  describe('postBusinessCase', () => {
    it('handles postBusinessCase.REQUEST', () => {
      const mockRequestAction = {
        type: postBusinessCase.REQUEST,
        payload: undefined
      };

      expect(businessCaseReducer(undefined, mockRequestAction)).toEqual({
        form: businessCaseInitialData,
        isLoading: null,
        isSaving: true,
        error: null
      });
    });
    it('handles postBusinessCase.SUCCESS', () => {
      const mockSuccessAction = {
        type: postBusinessCase.SUCCESS,
        payload: {
          id: 'c8e9fe76-e9bc-4a0c-b5c3-29b7bfa856d7',
          euaUserId: 'ABCD',
          systemIntake: 'a84f7cc3-75e1-4686-aaac-68af95455ae8',
          status: 'OPEN',
          projectName: 'Easy Access to System Information',
          requester: 'Kelly Stone',
          requesterPhoneNumber: '',
          businessOwner: '',
          businessNeed: '',
          cmsBenefit: '',
          priorityAlignment: '',
          successIndicators: '',
          asIsTitle: '',
          asIsSummary: '',
          asIsPros: '',
          asIsCons: '',
          asIsCostSavings: '',
          preferredTitle: '',
          preferredSummary: '',
          preferredAcquisitionApproach: '',
          preferredPros: '',
          preferredCons: '',
          preferredCostSavings: '',
          alternativeATitle: '',
          alternativeASummary: '',
          alternativeAAcquisitionApproach: '',
          alternativeAPros: '',
          alternativeACons: '',
          alternativeACostSavings: '',
          alternativeBTitle: null,
          alternativeBSummary: null,
          alternativeBAcquisitionApproach: null,
          alternativeBPros: null,
          alternativeBCons: null,
          alternativeBCostSavings: null,
          lifecycleCostLines: [],
          createdAt: '2020-05-22T23:42:18.626594-07:00',
          updatedAt: '2020-05-22T23:42:18.626594-07:00'
        }
      };

      expect(businessCaseReducer(undefined, mockSuccessAction)).toEqual({
        form: prepareBusinessCaseForApp(mockSuccessAction.payload),
        isLoading: null,
        isSaving: false,
        error: null
      });
    });

    it('handles postBusinessCase.FAILURE', () => {
      const initialState = {
        form: businessCaseInitialData,
        isLoading: false,
        isSaving: true,
        error: null
      };
      const mockFailureAction = {
        type: postBusinessCase.FAILURE,
        payload: 'Error'
      };

      expect(businessCaseReducer(initialState, mockFailureAction)).toEqual({
        form: businessCaseInitialData,
        isLoading: false,
        isSaving: true,
        error: 'Error'
      });
    });

    it('handles postBusinessCase.FULFILL', () => {
      const mockFulfillAction = {
        type: postBusinessCase.FULFILL,
        payload: undefined
      };

      expect(businessCaseReducer(undefined, mockFulfillAction)).toEqual({
        form: businessCaseInitialData,
        isLoading: null,
        isSaving: false,
        error: null
      });
    });
  });

  describe('putBusinessCase', () => {
    it('handles putBusinessCase.REQUEST', () => {
      const initialState = {
        form: {
          ...businessCaseInitialData,
          id: '5e579c80-31d0-4839-b1f8-d74bfa7d5e24'
        },
        isLoading: null,
        isSaving: true,
        isSubmitting: false,
        error: null
      };
      const mockRequestAction = {
        type: putBusinessCase.REQUEST,
        payload: {
          ...businessCaseInitialData,
          businessNeed: 'The quick brown fox jumps over the lazy dog',
          cmsBenefit: 'The quick brown fox jumps over the lazy dog',
          priorityAlignment: 'The quick brown fox jumps over the lazy dog',
          successIndicators: 'The quick brown fox jumps over the lazy dog'
        }
      };

      expect(businessCaseReducer(initialState, mockRequestAction)).toEqual({
        form: {
          ...businessCaseInitialData,
          id: '5e579c80-31d0-4839-b1f8-d74bfa7d5e24',
          businessNeed: 'The quick brown fox jumps over the lazy dog',
          cmsBenefit: 'The quick brown fox jumps over the lazy dog',
          priorityAlignment: 'The quick brown fox jumps over the lazy dog',
          successIndicators: 'The quick brown fox jumps over the lazy dog'
        },
        isLoading: null,
        isSaving: true,
        isSubmitting: false,
        error: null
      });
    });
  });

  describe('clearBusinessCase', () => {
    it('handles clearBusinessCase.TRIGGER', () => {
      const mockTriggerAction = {
        type: clearBusinessCase.TRIGGER,
        payload: null
      };

      expect(businessCaseReducer(undefined, mockTriggerAction)).toEqual({
        form: businessCaseInitialData,
        isLoading: null,
        isSaving: false,
        error: null
      });
    });
  });
});
