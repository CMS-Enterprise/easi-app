import { GET_SYSTEM_INTAKE } from '../constants/systemIntake';
import { SystemIntakeID } from '../types/systemIntake';

const initialState: SystemIntakeID = '';

function systemIntakeReducer(state = initialState, action: any): any {
  switch (action.type) {
    case GET_SYSTEM_INTAKE:
      return state;
    case '':
      return state;
    default:
      return state;
  }
}

export default systemIntakeReducer;
