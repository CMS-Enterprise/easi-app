import { DateTime } from 'luxon';
import { Action as ReduxAction } from 'redux-actions';

import { ActionState } from 'types/action';
import { fetchActions, fetchIntakeNotes, postAction } from 'types/routines';

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
    case fetchActions.TRIGGER:
      return {
        ...state,
        actions: []
      };
    case fetchActions.SUCCESS:
      return {
        ...state,
        actions: action.payload.map((fetchedAction: any) => ({
          ...fetchedAction,
          createdAt: DateTime.fromISO(fetchedAction.createdAt)
        }))
      };
    case fetchIntakeNotes.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}

export default actionReducer;
