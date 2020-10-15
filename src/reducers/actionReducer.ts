import { Action as ReduxAction } from 'redux-actions';

import { Action, ActionState } from 'types/action';
import { postSystemIntakeAction } from 'types/routines';

const initialState: ActionState = {
  isPosting: false,
  error: null
};

function actionReducer(
  state = initialState,
  action: ReduxAction<Action>
): ActionState {
  switch (action.type) {
    case postSystemIntakeAction.REQUEST:
      return {
        ...state,
        isPosting: true,
        error: null
      };
    case postSystemIntakeAction.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case postSystemIntakeAction.FULFILL:
      return {
        ...state,
        isPosting: false
      };
    default:
      return state;
  }
}

export default actionReducer;
