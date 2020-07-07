import { Action } from 'redux-actions';

const newTimeStamp = () => Date.now();

type authReducerState = {
  lastActiveAt: number;
  lastSessionRenew: number;
  sessionExpiration: number;
};

const UPDATE_LAST_ACTIVE_AT = 'AUTH_REDUCER_UPDATE_LAST_ACTIVE_AT';
const UPDATE_LAST_SESSION_RENEW = 'AUTH_REDUCER_UPDATE_LAST_SESSION_RENEW';

export const updateLastActiveAt = {
  type: UPDATE_LAST_ACTIVE_AT
};

export const updateLastSessionRenew = (expiresAt: number) => {
  return {
    type: UPDATE_LAST_SESSION_RENEW,
    payload: expiresAt
  };
};

const initialState: authReducerState = {
  lastActiveAt: newTimeStamp(),
  lastSessionRenew: 0,
  sessionExpiration: 0
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
        lastSessionRenew: newTimeStamp(),
        sessionExpiration: action.payload
      };
    default:
      return state;
  }
}

export default authReducer;
