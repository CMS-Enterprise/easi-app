import { DateTime } from 'luxon';
import { Action } from 'redux-actions';

import { prepareSystemIntakeForApp } from 'data/systemIntake';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm, SystemIntakesState } from 'types/systemIntake';
import { isIntakeClosed, isIntakeOpen } from 'utils/systemIntake';

const initialState: SystemIntakesState = {
  openIntakes: [],
  closedIntakes: [],
  isLoading: null,
  loadedTimestamp: null,
  error: null
};

function systemIntakesReducer(
  state = initialState,
  action: Action<any>
): SystemIntakesState {
  const openIntakes: SystemIntakeForm[] = [];
  const closedIntakes: SystemIntakeForm[] = [];
  switch (action.type) {
    case fetchSystemIntakes.REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case fetchSystemIntakes.SUCCESS:
      action.payload.forEach((intake: any) => {
        if (isIntakeOpen(intake.status)) {
          openIntakes.push(prepareSystemIntakeForApp(intake));
        } else if (isIntakeClosed(intake.status)) {
          closedIntakes.push(prepareSystemIntakeForApp(intake));
        }
      });
      return {
        ...state,
        openIntakes,
        closedIntakes,
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
