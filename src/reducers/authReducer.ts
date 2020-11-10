import { DateTime } from 'luxon';
import { Action } from 'redux-actions';

const newTimeStamp = () => Date.now();

type authReducerState = {
  lastActiveAt: number;
  lastRenewAt: number;
  groups: Array<string>;
  userGroupsSet: boolean;
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

const SET_USER_GROUPS = 'AUTH_REDUCER_SET_USER_GROUPS';
export const setUserGroups = (groups: Array<string>) => ({
  type: SET_USER_GROUPS,
  payload: { groups }
});

const initialState: authReducerState = {
  lastActiveAt: newTimeStamp(),
  lastRenewAt: newTimeStamp(),
  groups: [],
  userGroupsSet: false
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
    case SET_USER_GROUPS:
      return {
        ...state,
        groups: action.payload.groups,
        userGroupsSet: true
      };
    default:
      return state;
  }
}

export default authReducer;
