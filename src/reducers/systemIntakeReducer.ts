import { SystemIntakeState } from 'types/systemIntake';
import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from 'data/systemIntake';
import {
  fetchSystemIntake,
  storeSystemIntake,
  submitSystemIntake,
  clearSystemIntake,
  postSystemIntake
} from 'types/routines';
import { Action } from 'redux-actions';

const initialState: SystemIntakeState = {
  systemIntake: initialSystemIntakeForm,
  isLoading: null,
  isSaving: false,
  isSubmitting: false,
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
    case submitSystemIntake.REQUEST:
      return {
        ...state,
        isSubmitting: true,
        error: null
      };
    case submitSystemIntake.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case submitSystemIntake.FULFILL:
      return {
        ...state,
        isSubmitting: false
      };
    default:
      return state;
  }
}

export default systemIntakeReducer;
