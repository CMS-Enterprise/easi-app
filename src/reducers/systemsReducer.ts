import { STORE_SYSTEM_SHORTS } from '../constants/actions';
import { SystemState } from '../types/system';

const initialState: SystemState = {
  allSystemShorts: []
};

function systemsReducer(state = initialState, action: any): SystemState {
  switch (action.type) {
    case STORE_SYSTEM_SHORTS:
      return {
        ...state,
        allSystemShorts: action.shorts
      };
    default:
      return state;
  }
}

export default systemsReducer;
