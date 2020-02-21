import {
  GET_ALL_SYSTEM_SHORTS,
  UPDATE_SYSTEM_SHORTS
} from '../constants/system';
import { SystemState } from '../types/system';

const initialState: SystemState = {
  allSystemShorts: []
};

function systemsReducer(state = initialState, action: any): SystemState {
  switch (action.type) {
    case GET_ALL_SYSTEM_SHORTS:
      return state;
    case UPDATE_SYSTEM_SHORTS:
      return {
        ...state,
        allSystemShorts: action.shorts
      };
    case '':
      return state;
    default:
      return state;
  }
}

export default systemsReducer;
