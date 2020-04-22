import { STORE_SYSTEM_INTAKE } from '../constants/actions';
import { SystemIntakeState } from '../types/systemIntake';
import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from '../data/systemIntake';

const initialState: SystemIntakeState = {
  systemIntake: initialSystemIntakeForm()
};

function systemIntakeReducer(state = initialState, action: any): any {
  switch (action.type) {
    case STORE_SYSTEM_INTAKE:
      return {
        ...state,
        systemIntake: prepareSystemIntakeForApp(action.systemIntake)
      };
    default:
      return state;
  }
}

export default systemIntakeReducer;
