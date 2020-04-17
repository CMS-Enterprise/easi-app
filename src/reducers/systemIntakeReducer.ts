import { STORE_SYSTEM_INTAKE } from '../constants/actions';
import { SystemIntakeState, SystemIntakeForm } from '../types/systemIntake';
import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from '../data/systemIntake';

const initialState: SystemIntakeState = {};

function systemIntakeReducer(state = initialState, action: any): any {
  let systemIntake: SystemIntakeForm = initialSystemIntakeForm;
  if (action.systemIntake) {
    systemIntake = prepareSystemIntakeForApp(action.systemIntake);
  }
  switch (action.type) {
    case STORE_SYSTEM_INTAKE:
      return {
        ...state,
        systemIntake
      };
    default:
      return state;
  }
}

export default systemIntakeReducer;
