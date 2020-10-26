import { initialSystemIntakeForm } from 'data/systemIntake';
import { fetchRequestRepoIntakes } from 'types/routines';

import requestRepoReducer from './requestRepoReducer';

describe('The request repository reducer', () => {
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
    expect(
      requestRepoReducer(undefined, { type: '', payload: undefined })
    ).toEqual({
      openIntakes: [],
      closedIntakes: [],
      isLoading: null,
      error: null
    });
  });

  describe('fetchRequestRepoIntakes', () => {
    it('handles fetchRequestRepoIntakes.REQUEST', () => {
      const mockRequestAction = {
        type: fetchRequestRepoIntakes.REQUEST,
        payload: undefined
      };

      expect(requestRepoReducer(undefined, mockRequestAction)).toEqual({
        openIntakes: [],
        closedIntakes: [],
        isLoading: true,
        error: null
      });
    });

    it('handles fetchRequestRepoIntakes.SUCCESS', () => {
      const mockSuccessAction = {
        type: fetchRequestRepoIntakes.SUCCESS,
        payload: [
          {
            ...mockApiSystemIntake,
            projectName: 'Test 1',
            status: 'INTAKE_DRAFT'
          },
          {
            ...mockApiSystemIntake,
            projectName: 'Test 2',
            status: 'READY_FOR_GRT'
          },
          {
            ...mockApiSystemIntake,
            projectName: 'Test 3',
            status: 'LCID_ISSUED'
          },
          {
            ...mockApiSystemIntake,
            projectName: 'Test 4',
            status: 'WITHDRAWN'
          }
        ]
      };

      expect(
        requestRepoReducer(
          {
            openIntakes: [],
            closedIntakes: [],
            isLoading: true,
            error: null
          },
          mockSuccessAction
        )
      ).toEqual({
        openIntakes: [
          {
            ...initialSystemIntakeForm,
            requestName: 'Test 1',
            status: 'INTAKE_DRAFT'
          },
          {
            ...initialSystemIntakeForm,
            requestName: 'Test 2',
            status: 'READY_FOR_GRT'
          }
        ],
        closedIntakes: [
          {
            ...initialSystemIntakeForm,
            requestName: 'Test 3',
            status: 'LCID_ISSUED'
          },
          {
            ...initialSystemIntakeForm,
            requestName: 'Test 4',
            status: 'WITHDRAWN'
          }
        ],
        isLoading: true,
        error: null
      });
    });

    it('handles fetchRequestRepoIntakes.FAILURE', () => {
      const mockFailureAction = {
        type: fetchRequestRepoIntakes.FAILURE,
        payload: 'Error'
      };

      expect(
        requestRepoReducer(
          {
            openIntakes: [],
            closedIntakes: [],
            isLoading: true,
            error: null
          },
          mockFailureAction
        )
      ).toEqual({
        openIntakes: [],
        closedIntakes: [],
        isLoading: true,
        error: 'Error'
      });
    });

    it('handles fetchRequestRepoIntakes.FULFILL', () => {
      const mockFulfillAction = {
        type: fetchRequestRepoIntakes.FULFILL,
        payload: undefined
      };

      expect(
        requestRepoReducer(
          {
            openIntakes: [],
            closedIntakes: [],
            isLoading: true,
            error: null
          },
          mockFulfillAction
        )
      ).toEqual({
        openIntakes: [],
        closedIntakes: [],
        isLoading: false,
        error: null
      });
    });
  });
});
