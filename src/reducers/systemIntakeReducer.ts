import {
  GET_SYSTEM_INTAKE,
  UPDATE_SYSTEM_INTAKE
} from '../constants/systemIntake';
import { SystemIntakeState } from '../types/systemIntake';

const initialState: SystemIntakeState = {};

function systemIntakeReducer(state = initialState, action: any): any {
  switch (action.type) {
    case GET_SYSTEM_INTAKE:
      return state;
    case UPDATE_SYSTEM_INTAKE:
      return {
        ...state,
        systemIntake: action.systemIntake
      };
    case '':
      return state;
    default:
      return state;
  }
}

export default systemIntakeReducer;
