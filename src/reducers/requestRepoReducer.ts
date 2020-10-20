import { Action } from 'redux-actions';

import { prepareSystemIntakeForApp } from 'data/systemIntake';
import { fetchRequestRepoIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';
import { isIntakeClosed, isIntakeOpen } from 'utils/systemIntake';

type RequestRepoState = {
  openIntakes: SystemIntakeForm[];
  closedIntakes: SystemIntakeForm[];
  isLoading: boolean | null;
  error: string | null;
};

const initialState: RequestRepoState = {
  openIntakes: [],
  closedIntakes: [],
  isLoading: null,
  error: null
};

function requestRepoReducer(
  state = initialState,
  action: Action<any>
): RequestRepoState {
  switch (action.type) {
    case fetchRequestRepoIntakes.REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case fetchRequestRepoIntakes.SUCCESS: {
      const openIntakes: SystemIntakeForm[] = [];
      const closedIntakes: SystemIntakeForm[] = [];
      action.payload.forEach((intake: any) => {
        if (isIntakeOpen(intake.status)) {
          openIntakes.push(prepareSystemIntakeForApp(intake));
        } else if (isIntakeClosed(intake.status)) {
          closedIntakes.push(prepareSystemIntakeForApp(intake));
        } else {
          console.warn(`Intake ${intake.projectName} has an invalid status.`);
        }
      });

      return {
        ...state,
        openIntakes,
        closedIntakes
      };
    }
    case fetchRequestRepoIntakes.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case fetchRequestRepoIntakes.FULFILL:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

export default requestRepoReducer;
