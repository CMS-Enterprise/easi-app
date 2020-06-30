import { Action } from 'redux-actions';

const newTimeStamp = () => Date.now();

type authReducerState = {
  lastActiveAt: number;
  lastSessionRenew: number | null;
};

const UPDATE_LAST_ACTIVE_AT = 'AUTH_REDUCER_UPDATE_LAST_ACTIVE_AT';
const UPDATE_LAST_SESSION_RENEW = 'AUTH_REDUCER_UPDATE_LAST_SESSION_RENEW';

export const updateLastActiveAt = {
  type: UPDATE_LAST_ACTIVE_AT
};

export const updateLastSessionRenew = {
  type: UPDATE_LAST_SESSION_RENEW
};

const initialState: authReducerState = {
  lastActiveAt: newTimeStamp(),
  lastSessionRenew: null
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
    case UPDATE_LAST_SESSION_RENEW:
      return {
        ...state,
        lastSessionRenew: newTimeStamp()
      };
    default:
      return state;
  }
}

export default authReducer;
