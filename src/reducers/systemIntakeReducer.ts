import { Action } from 'redux-actions';

import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from 'data/systemIntake';
import {
  archiveSystemIntake,
  clearSystemIntake,
  fetchSystemIntake,
  postSystemIntake,
  reviewSystemIntake,
  saveSystemIntake,
  storeSystemIntake
} from 'types/routines';
import { SystemIntakeState } from 'types/systemIntake';

const initialState: SystemIntakeState = {
  systemIntake: initialSystemIntakeForm,
  isLoading: null,
  isSaving: false,
  error: null
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
    case postSystemIntake.REQUEST:
      return {
        ...state,
        isSaving: true
      };
    case postSystemIntake.SUCCESS:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          ...prepareSystemIntakeForApp(action.payload)
        }
      };
    case postSystemIntake.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case postSystemIntake.FULFILL:
      return {
        ...state,
        isSaving: false
      };
    case saveSystemIntake.REQUEST:
      return {
        ...state,
        isSaving: true
      };
    case saveSystemIntake.SUCCESS:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          ...prepareSystemIntakeForApp(action.payload)
        }
      };
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
    case storeSystemIntake.TRIGGER:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          ...action.payload
        },
        isLoading: false,
        error: null
      };
    case storeSystemIntake.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case storeSystemIntake.FULFILL:
      return {
        ...state,
        isLoading: false
      };
    case reviewSystemIntake.REQUEST:
      return {
        ...state,
        error: null
      };
    case reviewSystemIntake.SUCCESS:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          ...prepareSystemIntakeForApp(action.payload)
        }
      };
    case reviewSystemIntake.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case archiveSystemIntake.SUCCESS:
      return initialState;
    default:
      return state;
  }
}

export default systemIntakeReducer;
