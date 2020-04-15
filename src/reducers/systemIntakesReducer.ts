import { STORE_SYSTEM_INTAKES } from '../constants/actions';
import { SystemIntakesState } from '../types/systemIntake';

const initialState: SystemIntakesState = {
  systemIntakes: []
};

function systemIntakesReducer(
  state = initialState,
  action: any
): SystemIntakesState {
  switch (action.type) {
    case STORE_SYSTEM_INTAKES:
      return {
        ...state,
        systemIntakes: action.systemIntakes
      };
    default:
      return state;
  }
}

export default systemIntakesReducer;
