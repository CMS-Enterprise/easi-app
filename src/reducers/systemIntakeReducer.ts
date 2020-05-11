import { SystemIntakeState } from 'types/systemIntake';
import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from 'data/systemIntake';
import { fetchSystemIntake, storeSystemIntakeId } from 'types/routines';
import { Action } from 'redux-actions';

const initialState: SystemIntakeState = {
  systemIntake: initialSystemIntakeForm,
  isLoading: null
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
    case storeSystemIntakeId.TRIGGER:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          id: action.payload
        },
        isLoading: false
      };
    case storeSystemIntakeId.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case storeSystemIntakeId.FULFILL:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

export default systemIntakeReducer;
