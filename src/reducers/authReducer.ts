import { DateTime } from 'luxon';
import { Action } from 'redux-actions';

const newTimeStamp = () => Date.now();

type authReducerState = {
  lastActiveAt: number;
  lastRenewAt: number;
  name: string;
  euaId: string;
  groups: Array<string>;
  isUserSet: boolean;
};

const UPDATE_LAST_ACTIVE_AT = 'AUTH_REDUCER_UPDATE_LAST_ACTIVE_AT';

export const updateLastActiveAt = (lastActiveAt: DateTime) => {
  return {
    type: UPDATE_LAST_ACTIVE_AT,
    payload: {
      lastActiveAt
    }
  };
};

const UPDATE_LAST_RENEW_AT = 'AUTH_REDUCER_UPDATE_LAST_RENEW_AT';

export const updateLastRenewAt = (lastRenewAt: DateTime) => {
  return {
    type: UPDATE_LAST_RENEW_AT,
    payload: {
      lastRenewAt
    }
  };
};

const SET_USER = 'AUTH_REDUCER_SET_USER';
export const setUser = (user: any) => ({
  type: SET_USER,
  payload: user
});

const initialState: authReducerState = {
  lastActiveAt: newTimeStamp(),
  lastRenewAt: newTimeStamp(),
  name: '',
  euaId: '',
  groups: [],
  isUserSet: false
};

function authReducer(
  state = initialState,
  action: Action<any>
): authReducerState {
  switch (action.type) {
    case UPDATE_LAST_ACTIVE_AT:
      return {
        ...state,
        lastActiveAt: action.payload.lastActiveAt
      };
    case UPDATE_LAST_RENEW_AT:
      return {
        ...state,
        lastRenewAt: action.payload.lastRenewAt
      };
    case SET_USER:
      return {
        ...state,
        ...action.payload,
        isUserSet: true
      };
    default:
      return state;
  }
}

export default authReducer;
