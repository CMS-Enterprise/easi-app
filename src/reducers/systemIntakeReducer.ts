import { Action } from 'redux-actions';

import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from 'data/systemIntake';
import {
  archiveSystemIntake,
  clearSystemIntake,
  fetchSystemIntake,
  saveSystemIntake
} from 'types/routines';
import { SystemIntakeState } from 'types/systemIntake';

const initialState: SystemIntakeState = {
  systemIntake: initialSystemIntakeForm,
  isLoading: null,
  isSaving: false,
  isNewIntakeCreated: null,
  error: null,
  notes: []
};

function systemIntakeReducer(
  state = initialState,
  action: Action<any>
): SystemIntakeState {
  switch (action.type) {
    case fetchSystemIntake.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case fetchSystemIntake.SUCCESS:
      return {
        ...state,
        systemIntake: prepareSystemIntakeForApp(action.payload)
      };
    case fetchSystemIntake.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case fetchSystemIntake.FULFILL:
      return {
        ...state,
        isLoading: false
      };
    case clearSystemIntake.TRIGGER:
      return initialState;
    case saveSystemIntake.REQUEST:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          ...action.payload
        },
        isSaving: true
      };
    case saveSystemIntake.SUCCESS:
      return state;
    case saveSystemIntake.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case saveSystemIntake.FULFILL:
      return {
        ...state,
        isSaving: false
      };
    case archiveSystemIntake.SUCCESS:
      return initialState;
    default:
      return state;
  }
}

export default systemIntakeReducer;
