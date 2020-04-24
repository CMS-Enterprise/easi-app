import { SystemIntakesState } from 'types/systemIntake';
import { prepareSystemIntakeForApp } from 'data/systemIntake';
import { fetchSystemIntakes } from 'routines/routines';
import { DateTime } from 'luxon';
import { LoadingStatus } from 'reducers/rootReducer';

const initialState: SystemIntakesState = {
  systemIntakes: [],
  loadingStatus: LoadingStatus.Unstarted
};

function systemIntakesReducer(
  state = initialState,
  action: any
): SystemIntakesState {
  switch (action.type) {
    case fetchSystemIntakes.REQUEST:
      return {
        ...state,
        loadingStatus: LoadingStatus.InProgress
      };
    case fetchSystemIntakes.SUCCESS:
      return {
        ...state,
        systemIntakes: action.payload.map((intake: any) =>
          prepareSystemIntakeForApp(intake)
        ),
        loadingStatus: LoadingStatus.Success,
        loadedTimestamp: DateTime.local()
      };
    case fetchSystemIntakes.FAILURE:
      return {
        ...state,
        loadingStatus: LoadingStatus.Failure,
        error: action.payload
      };
    default:
      return state;
  }
}

export default systemIntakesReducer;
