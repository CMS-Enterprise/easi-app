import { STORE_SYSTEM_INTAKES } from 'constants/actions';
import { SystemIntakesState } from 'types/systemIntake';
import { prepareSystemIntakeForApp } from 'data/systemIntake';

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
        systemIntakes: action.systemIntakes.map((intake: any) =>
          prepareSystemIntakeForApp(intake)
        )
      };
    default:
      return state;
  }
}

export default systemIntakesReducer;
