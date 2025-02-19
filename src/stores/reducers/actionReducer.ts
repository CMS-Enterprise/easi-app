import { Action as ReduxAction } from 'redux-actions';

import { ActionState } from 'types/action';
import { postAction } from 'types/routines';

const initialState: ActionState = {
  isPosting: false,
  error: null,
  actions: []
};

function actionReducer(
  state = initialState,
  action: ReduxAction<any>
): ActionState {
  switch (action.type) {
    case postAction.REQUEST:
      return {
        ...state,
        isPosting: true,
        error: null
      };
    case postAction.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case postAction.FULFILL:
      return {
        ...state,
        isPosting: false
      };
    default:
      return state;
  }
}

export default actionReducer;
