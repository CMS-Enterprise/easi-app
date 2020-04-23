import { SystemIntakesState } from 'types/systemIntake';
import { prepareSystemIntakeForApp } from 'data/systemIntake';
import { fetchSystemIntakes } from 'routines/routines';
import { DateTime } from 'luxon';

const initialState: SystemIntakesState = {
  systemIntakes: [],
  loaded: false,
  loadedTimestamp: null,
  error: null
};

function systemIntakesReducer(
  state = initialState,
  action: any
): SystemIntakesState {
  switch (action.type) {
    case fetchSystemIntakes.TRIGGER:
      return {
        ...state,
        loaded: false
      };
    case fetchSystemIntakes.REQUEST:
      return state;
    case fetchSystemIntakes.SUCCESS:
      console.log(action);
      return {
        ...state,
        systemIntakes: action.payload.map((intake: any) =>
          prepareSystemIntakeForApp(intake)
        )
      };
    case fetchSystemIntakes.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case fetchSystemIntakes.FULFILL:
      return {
        ...state,
        loaded: true,
        loadedTimestamp: DateTime.local()
      };
    default:
      return state;
  }
}

export default systemIntakesReducer;
