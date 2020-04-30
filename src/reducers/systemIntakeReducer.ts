import { SystemIntakeState } from 'types/systemIntake';
import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from 'data/systemIntake';
import { fetchSystemIntake } from 'types/routines';
import { Action } from 'redux-actions';

const initialState: SystemIntakeState = {
  systemIntake: initialSystemIntakeForm
};

function systemIntakeReducer(
  state = initialState,
  action: Action<any>
): SystemIntakeState {
  switch (action.type) {
    case fetchSystemIntake.SUCCESS:
      return {
        ...state,
        systemIntake: prepareSystemIntakeForApp(action.payload)
      };
    default:
      return state;
  }
}

export default systemIntakeReducer;
