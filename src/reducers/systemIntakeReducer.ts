import { STORE_SYSTEM_INTAKE } from '../constants/actions';
import { SystemIntakeState } from '../types/systemIntake';

const initialState: SystemIntakeState = {};

function systemIntakeReducer(state = initialState, action: any): any {
  switch (action.type) {
    case STORE_SYSTEM_INTAKE:
      return {
        ...state,
        systemIntake: action.systemIntake
      };
    default:
      return state;
  }
}

export default systemIntakeReducer;
