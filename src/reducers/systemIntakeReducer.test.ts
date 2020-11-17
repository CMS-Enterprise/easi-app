import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from 'data/systemIntake';
import systemIntakeReducer from 'reducers/systemIntakeReducer';
import {
  clearSystemIntake,
  fetchSystemIntake,
  postIntakeNote,
  postSystemIntake,
  saveSystemIntake,
  storeSystemIntake
} from 'types/routines';

describe('The system intake reducer', () => {
  const mockApiSystemIntake = {
    id: '',
    status: 'INTAKE_DRAFT',
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
    fundingNumber: '',
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
      isNewIntakeCreated: null,
      error: null,
      notes: []
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
        isNewIntakeCreated: null,
        error: null,
        notes: []
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
        isNewIntakeCreated: null,
        error: null,
        notes: []
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
        isNewIntakeCreated: null,
        error: null,
        notes: []
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
        isNewIntakeCreated: null,
        error: null,
        notes: []
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
        isNewIntakeCreated: null,
        error: 'Error',
        notes: []
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
        isNewIntakeCreated: null,
        error: null,
        notes: []
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
        isNewIntakeCreated: null,
        error: null,
        notes: []
      });
    });
    it('handles postSystemIntake.SUCCESS', () => {
      const mockSuccessAction = {
        type: postSystemIntake.SUCCESS,
        payload: prepareSystemIntakeForApp(mockApiSystemIntake)
      };

      expect(systemIntakeReducer(undefined, mockSuccessAction)).toEqual({
        systemIntake: mockSuccessAction.payload,
        isLoading: null,
        isSaving: false,
        isNewIntakeCreated: true,
        error: null,
        notes: []
      });
    });

    it('handles postSystemIntake.FAILURE', () => {
      const initialState = {
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      };
      const mockFailureAction = {
        type: postSystemIntake.FAILURE,
        payload: 'Error'
      };

      expect(systemIntakeReducer(initialState, mockFailureAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isNewIntakeCreated: false,
        error: 'Error',
        notes: []
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
        isNewIntakeCreated: null,
        error: null,
        notes: []
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
        isNewIntakeCreated: null,
        error: null,
        notes: []
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
        isNewIntakeCreated: null,
        error: null,
        notes: []
      });
    });

    it('handles saveSystemIntake.FAILURE', () => {
      const initialState = {
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      };
      const mockFailureAction = {
        type: saveSystemIntake.FAILURE,
        payload: 'Error'
      };

      expect(systemIntakeReducer(initialState, mockFailureAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isNewIntakeCreated: null,
        error: 'Error',
        notes: []
      });
    });

    it('handles saveSystemIntake.FULFILL', () => {
      const initialState = {
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: true,
        isNewIntakeCreated: null,
        error: null,
        notes: []
      };

      const mockFulfillAction = {
        type: saveSystemIntake.FULFILL,
        payload: undefined
      };

      expect(systemIntakeReducer(initialState, mockFulfillAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: false,
        isSaving: false,
        isNewIntakeCreated: null,
        error: null,
        notes: []
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
        isNewIntakeCreated: null,
        error: null,
        notes: []
      });
    });
  });

  describe('postIntakeNote', () => {
    it('adds successfully created note to the reducer', () => {
      const mockPostAction = {
        type: postIntakeNote.SUCCESS,
        payload: {
          id: '12345',
          authorName: 'John Brown',
          authorId: 'ABCD',
          content: 'Test Note 1',
          systemIntakeId: 'test-uuid-note-1'
        }
      };

      expect(systemIntakeReducer(undefined, mockPostAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: false,
        isNewIntakeCreated: null,
        error: null,
        notes: [
          {
            id: '12345',
            authorName: 'John Brown',
            authorId: 'ABCD',
            content: 'Test Note 1',
            systemIntakeId: 'test-uuid-note-1'
          }
        ]
      });
    });

    it('appends successfully created note to the reducer', () => {
      const initialState = {
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: false,
        isNewIntakeCreated: null,
        error: null,
        notes: [
          {
            id: '12345',
            authorName: 'John Brown',
            authorId: 'ABCD',
            content: 'Test Note 1',
            systemIntakeId: 'test-uuid-note-1'
          }
        ]
      };

      const mockPostAction = {
        type: postIntakeNote.SUCCESS,
        payload: {
          id: '67890',
          authorName: 'Lisa Brown',
          authorId: 'EFGH',
          content: 'Test Note 2',
          systemIntakeId: 'test-uuid-note-2'
        }
      };

      expect(systemIntakeReducer(initialState, mockPostAction)).toEqual({
        systemIntake: initialSystemIntakeForm,
        isLoading: null,
        isSaving: false,
        isNewIntakeCreated: null,
        error: null,
        notes: [
          {
            id: '12345',
            authorName: 'John Brown',
            authorId: 'ABCD',
            content: 'Test Note 1',
            systemIntakeId: 'test-uuid-note-1'
          },
          {
            id: '67890',
            authorName: 'Lisa Brown',
            authorId: 'EFGH',
            content: 'Test Note 2',
            systemIntakeId: 'test-uuid-note-2'
          }
        ]
      });
    });
  });
});
