import {
  FETCH_SYSTEM_INTAKES,
  STORE_SYSTEM_INTAKES
} from '../constants/systemIntakes';
import { SystemIntakesState } from '../types/systemIntake';

const initialState: SystemIntakesState = {
  systemIntakes: []
};

function systemIntakesReducer(
  state = initialState,
  action: any
): SystemIntakesState {
  switch (action.type) {
    case FETCH_SYSTEM_INTAKES:
      return state;
    case STORE_SYSTEM_INTAKES:
      return {
        ...state,
        systemIntakes: action.systemIntakes
      };
    case '':
      return state;
    default:
      return state;
  }
}

export default systemIntakesReducer;
