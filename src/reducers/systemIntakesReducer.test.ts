import { prepareSystemIntakeForApp } from 'data/systemIntake';
import { fetchSystemIntakes } from 'types/routines';

import systemIntakesReducer from './systemIntakesReducer';

describe('The system intakes reducer', () => {
  it('returns the initial state', () => {
    expect(systemIntakesReducer(undefined, {})).toEqual({
      openIntakes: [],
      closedIntakes: [],
      error: null,
      isLoading: null,
      loadedTimestamp: null
    });
  });

  it('handles fetchSystemIntakes.REQUEST', () => {
    const mockRequestAction = {
      type: fetchSystemIntakes.REQUEST,
      payload: undefined
    };

    expect(systemIntakesReducer(undefined, mockRequestAction)).toEqual({
      openIntakes: [],
      closedIntakes: [],
      error: null,
      isLoading: true,
      loadedTimestamp: null
    });
  });

  it('handles fetchSystemIntakes.SUCCESS', () => {
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
      fundingNUmber: '',
      businessNeed: '',
      solution: '',
      processStatus: '',
      eaSupportRequest: null,
      existingContract: ''
    };
    const mockSuccessAction = {
      type: fetchSystemIntakes.SUCCESS,
      payload: [mockApiSystemIntake]
    };

    expect(
      systemIntakesReducer(undefined, mockSuccessAction).openIntakes
    ).toMatchObject([prepareSystemIntakeForApp(mockApiSystemIntake)]);
  });

  it('fetchSystemIntakes.SUCCESS differentiates open and closed intakes', () => {
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
      fundingNUmber: '',
      businessNeed: '',
      solution: '',
      processStatus: '',
      eaSupportRequest: null,
      existingContract: ''
    };
    const mockSuccessAction = {
      type: fetchSystemIntakes.SUCCESS,
      payload: [
        {
          ...mockApiSystemIntake,
          status: 'INTAKE_SUBMITTED'
        },
        {
          ...mockApiSystemIntake,
          status: 'LCID_ISSUED'
        },
        {
          ...mockApiSystemIntake,
          status: 'WITHDRAWN'
        },
        {
          ...mockApiSystemIntake,
          status: 'NEED_BIZ_CASE'
        },
        {
          ...mockApiSystemIntake,
          status: 'BIZ_CASE_FINAL_NEEDED'
        },
        {
          ...mockApiSystemIntake,
          status: 'READY_FOR_GRT'
        },
        {
          ...mockApiSystemIntake,
          status: 'NOT_APPROVED'
        },
        {
          ...mockApiSystemIntake,
          status: 'NO_GOVERNANCE'
        },
        {
          ...mockApiSystemIntake,
          status: 'NOT_IT_REQUEST'
        }
      ]
    };

    expect(
      systemIntakesReducer(undefined, mockSuccessAction).openIntakes.length
    ).toEqual(4);

    expect(
      systemIntakesReducer(undefined, mockSuccessAction).closedIntakes.length
    ).toEqual(5);
  });

  it('handles fetchSystemIntakes.FAILURE', () => {
    const mockFailureAction = {
      type: fetchSystemIntakes.FAILURE,
      payload: 'Error'
    };

    expect(systemIntakesReducer(undefined, mockFailureAction)).toEqual({
      openIntakes: [],
      closedIntakes: [],
      error: 'Error',
      isLoading: null,
      loadedTimestamp: null
    });
  });

  it('handles fetchSystemIntakes.FULFILL', () => {
    const mockFulfillAction = {
      type: fetchSystemIntakes.FULFILL,
      payload: undefined
    };

    expect(systemIntakesReducer(undefined, mockFulfillAction)).toEqual({
      openIntakes: [],
      closedIntakes: [],
      error: null,
      isLoading: false,
      loadedTimestamp: null
    });
  });
});
