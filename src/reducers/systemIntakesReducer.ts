import { SystemIntakesState } from 'types/systemIntake';
import { prepareSystemIntakeForApp } from 'data/systemIntake';
import { fetchSystemIntakes } from 'types/routines';
import { DateTime } from 'luxon';
import { Action } from 'redux-actions';

const initialState: SystemIntakesState = {
  systemIntakes: []
};

function systemIntakesReducer(
  state = initialState,
  action: Action<any>
): SystemIntakesState {
  switch (action.type) {
    case fetchSystemIntakes.REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case fetchSystemIntakes.SUCCESS:
      return {
        ...state,
        systemIntakes: action.payload.map((intake: any) =>
          prepareSystemIntakeForApp(intake)
        ),
        loadedTimestamp: DateTime.local()
      };
    case fetchSystemIntakes.FULFILL:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

export default systemIntakesReducer;
