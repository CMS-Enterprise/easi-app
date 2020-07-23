import { Action } from 'redux-actions';

const newTimeStamp = () => Date.now();

type authReducerState = {
  lastActiveAt: number;
  lastRenewAt: number;
};

const UPDATE_LAST_ACTIVE_AT = 'AUTH_REDUCER_UPDATE_LAST_ACTIVE_AT';

export const updateLastActiveAt = {
  type: UPDATE_LAST_ACTIVE_AT
};

const UPDATE_LAST_RENEW_AT = 'AUTH_REDUCER_UPDATE_LAST_RENEW_AT';

export const updateLastRenewAt = {
  type: UPDATE_LAST_RENEW_AT
};

const initialState: authReducerState = {
  lastActiveAt: newTimeStamp(),
  lastRenewAt: newTimeStamp()
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
    case UPDATE_LAST_RENEW_AT:
      return {
        ...state,
        lastRenewAt: newTimeStamp()
      };
    default:
      return state;
  }
}

export default authReducer;
