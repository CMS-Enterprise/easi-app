import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from 'data/systemIntake';
import {
  fetchSystemIntake,
  storeSystemIntake,
  submitSystemIntake,
  saveSystemIntake,
  clearSystemIntake,
  postSystemIntake
} from 'types/routines';
import systemIntakeReducer from 'reducers/systemIntakeReducer';

describe('The system intake reducer', () => {
  const mockApiSystemIntake = {
    id: '',
    status: 'DRAFT',
    requester: '',
    component: '',
    businessOwner: '',
    businessOwnerComponent: '',
    productManager: '',
    productManagerComponent: '',
    isso: '',
    trbCollaborator: '',
    oitSecurityCollaborator: '',
    eaCollaborator: '',
    projectName: '',
    existingFunding: null,
    fundingSource: '',
    businessNeed: '',
    solution: '',
    processStatus: '',
    eaSupportRequest: null,
    existingContract: ''
  };
  it('returns the initial state', () => {
    // @ts-ignore
    expect(systemIntakeReducer(undefined, {})).toEqual({
      systemIntake: initialSystemIntakeForm,
      isLoading: null,
      isSaving: false,
      isSubmitting: false,
      error: null
    });
  });

  describe('fetchSystemIntake', () => {
    it('handles fetchSystemIntake.REQUEST', () => {
      const mockRequestAction = {
        type: fetchSystemIntake.REQUEST,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockRequestAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: true,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });

    it('handles fetchSystemIntake.SUCCESS', () => {
      const mockPayload = {
        ...mockApiSystemIntake,
        id: '123',
        requester: 'Tom',
        component: 'My Test Component'
      };
      const mockSuccessAction = {
        type: fetchSystemIntake.SUCCESS,
        payload: mockPayload
      };

      expect(systemIntakeReducer(undefined, mockSuccessAction)).toEqual({
        systemIntake: prepareSystemIntakeForApp(mockPayload),
        isLoading: null,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });

    it('handles fetchSystemIntake.FULFILL', () => {
      const mockFulfillAction = {
        type: fetchSystemIntake.FULFILL,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockFulfillAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });
  });

  describe('storeSystemIntake', () => {
    it('handles storeSystemIntake.TRIGGER', () => {
      const payload = {
        id: '123',
        requester: {
          name: 'Tom Foolery',
          component: 'My Test Component'
        }
      };
      const mockTriggerAction = {
        type: storeSystemIntake.TRIGGER,
        payload
      };

      expect(systemIntakeReducer(undefined, mockTriggerAction)).toEqual({
        systemIntake: {
          ...initialSystemIntakeForm,
          ...payload
        },
        isLoading: false,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });
    it('handles storeSystemIntake.FAILURE', () => {
      const mockFailureAction = {
        type: storeSystemIntake.FAILURE,
        payload: 'Error'
      };

      expect(systemIntakeReducer(undefined, mockFailureAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: false,
        isSubmitting: false,
        error: 'Error'
      });
    });
    it('handles storeSystemIntake.FULFILL', () => {
      const mockFulfillAction = {
        type: storeSystemIntake.FULFILL,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockFulfillAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });
  });

  describe('submitSystemIntake', () => {
    it('handles submitSystemIntake.REQUEST', () => {
      const mockRequestAction = {
        type: submitSystemIntake.REQUEST,
        payload: initialSystemIntakeForm
      };

      expect(systemIntakeReducer(undefined, mockRequestAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: false,
        isSubmitting: true,
        error: null
      });
    });

    it('handles submitSystemIntake.FAILURE', () => {
      const mockFailureAction = {
        type: submitSystemIntake.FAILURE,
        payload: 'Error Error'
      };

      expect(systemIntakeReducer(undefined, mockFailureAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: false,
        isSubmitting: false,
        error: 'Error Error'
      });
    });

    it('handles submitSystemIntake.FULFILL', () => {
      const mockFulfillAction = {
        type: submitSystemIntake.FULFILL,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockFulfillAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });
  });

  describe('postSystemIntake', () => {
    it('handles postSystemIntake.REQUEST', () => {
      const mockRequestAction = {
        type: postSystemIntake.REQUEST,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockRequestAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: true,
        isSubmitting: false,
        error: null
      });
    });
    it('handles postSystemIntake.SUCCESS', () => {
      const mockSuccessAction = {
        type: postSystemIntake.SUCCESS,
        payload: mockApiSystemIntake
      };

      expect(systemIntakeReducer(undefined, mockSuccessAction)).toEqual({
        systemIntake: prepareSystemIntakeForApp(mockSuccessAction.payload),
        isLoading: null,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });

    it('handles postSystemIntake.FAILURE', () => {
      const initialState = {
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isSubmitting: false,
        error: null
      };
      const mockFailureAction = {
        type: postSystemIntake.FAILURE,
        payload: 'Error'
      };

      expect(systemIntakeReducer(initialState, mockFailureAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isSubmitting: false,
        error: 'Error'
      });
    });

    it('handles postSystemIntake.FULFILL', () => {
      const mockFulfillAction = {
        type: postSystemIntake.FULFILL,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockFulfillAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });
  });

  describe('saveSystemIntake', () => {
    it('handles saveSystemIntake.REQUEST', () => {
      const mockRequestAction = {
        type: saveSystemIntake.REQUEST,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockRequestAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: true,
        isSubmitting: false,
        error: null
      });
    });
    it('handles saveSystemIntake.SUCCESS', () => {
      const mockSuccessAction = {
        type: saveSystemIntake.SUCCESS,
        payload: mockApiSystemIntake
      };

      expect(systemIntakeReducer(undefined, mockSuccessAction)).toEqual({
        systemIntake: prepareSystemIntakeForApp(mockSuccessAction.payload),
        isLoading: null,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });

    it('handles saveSystemIntake.FAILURE', () => {
      const initialState = {
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isSubmitting: false,
        error: null
      };
      const mockFailureAction = {
        type: saveSystemIntake.FAILURE,
        payload: 'Error'
      };

      expect(systemIntakeReducer(initialState, mockFailureAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isSubmitting: false,
        error: 'Error'
      });
    });

    it('handles saveSystemIntake.FULFILL', () => {
      const initialState = {
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isSubmitting: false,
        error: null
      };

      const mockFulfillAction = {
        type: saveSystemIntake.FULFILL,
        payload: undefined
      };

      expect(systemIntakeReducer(initialState, mockFulfillAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });
  });

  describe('clearSystemIntake', () => {
    it('handles clearSystemIntake.TRIGGER', () => {
      const mockRequestAction = {
        type: clearSystemIntake.TRIGGER,
        payload: undefined
      };

      expect(systemIntakeReducer(undefined, mockRequestAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: false,
        isSubmitting: false,
        error: null
      });
    });
  });
});
