import { UPDATE_SYSTEM_SHORTS } from '../constants/system';
import { SystemState } from '../types/system';

const initialState: SystemState = {
  allSystemShorts: []
};

function systemsReducer(state = initialState, action: any): SystemState {
  switch (action.type) {
    case UPDATE_SYSTEM_SHORTS:
      return {
        ...state,
        allSystemShorts: action.shorts
      };
    default:
      return state;
  }
}

export default systemsReducer;
