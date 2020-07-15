import { Action } from 'redux-actions';

const newTimeStamp = () => Date.now();

type authReducerState = {
  lastActiveAt: number;
};

const UPDATE_LAST_ACTIVE_AT = 'AUTH_REDUCER_UPDATE_LAST_ACTIVE_AT';

export const updateLastActiveAt = {
  type: UPDATE_LAST_ACTIVE_AT
};

const initialState: authReducerState = {
  lastActiveAt: newTimeStamp()
};

function authReducer(
  state = initialState,
  action: Action<any>
): authReducerState {
  switch (action.type) {
    case UPDATE_LAST_ACTIVE_AT:
      return {
        ...state,
        lastActiveAt: newTimeStamp()
      };
    default:
      return state;
  }
}

export default authReducer;
