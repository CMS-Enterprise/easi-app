import { SystemIntakeState } from 'types/systemIntake';
import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from 'data/systemIntake';
import {
  fetchSystemIntake,
  storeSystemIntake,
  submitSystemIntake
} from 'types/routines';
import { Action } from 'redux-actions';

const initialState: SystemIntakeState = {
  systemIntake: initialSystemIntakeForm,
  isLoading: null,
  isSubmitting: false
};

function systemIntakeReducer(
  state = initialState,
  action: Action<any>
): SystemIntakeState {
  switch (action.type) {
    case fetchSystemIntake.REQUEST:
      return {
        ...state,
        isLoading: true
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
    case storeSystemIntake.TRIGGER:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          ...action.payload
        },
        isLoading: false
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
        isSubmitting: true
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
