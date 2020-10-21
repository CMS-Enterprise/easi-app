import { prepareSystemIntakeForApp } from 'data/systemIntake';
import { fetchSystemIntakes } from 'types/routines';

import systemIntakesReducer from './systemIntakesReducer';

describe('The system intakes reducer', () => {
  it('returns the initial state', () => {
    expect(systemIntakesReducer(undefined, {})).toEqual({
      systemIntakes: [],
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
      systemIntakes: [],
      error: null,
      isLoading: true,
      loadedTimestamp: null
    });
  });
  it('handles fetchSystemIntakes.SUCCESS', () => {
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
      systemIntakesReducer(undefined, mockSuccessAction).systemIntakes
    ).toMatchObject([prepareSystemIntakeForApp(mockApiSystemIntake)]);
  });
  it('handles fetchSystemIntakes.FAILURE', () => {
    const mockFailureAction = {
      type: fetchSystemIntakes.FAILURE,
      payload: 'Error'
    };

    expect(systemIntakesReducer(undefined, mockFailureAction)).toEqual({
      systemIntakes: [],
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
      systemIntakes: [],
      error: null,
      isLoading: false,
      loadedTimestamp: null
    });
  });
});
