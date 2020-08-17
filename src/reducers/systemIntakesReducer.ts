import { DateTime } from 'luxon';
import { Action } from 'redux-actions';

import { prepareSystemIntakeForApp } from 'data/systemIntake';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakesState } from 'types/systemIntake';

const initialState: SystemIntakesState = {
  systemIntakes: [],
  isLoading: null,
  loadedTimestamp: null,
  error: null
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
    case fetchSystemIntakes.FAILURE:
      return {
        ...state,
        error: action.payload
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
