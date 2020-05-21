import { Action } from 'redux-actions';

const newTimeStamp = () => new Date().getTime();

type authReducerState = {
  lastActiveAt: number;
};

export const updateLastActiveAt = {
  type: 'AUTH_REDUCER_UPDATE_LAST_ACTIVE_AT'
};

const initialState: authReducerState = {
  lastActiveAt: newTimeStamp()
};

function authReducer(
  state = initialState,
  action: Action<any>
): authReducerState {
  switch (action.type) {
    case updateLastActiveAt.type:
      return {
        ...state,
        lastActiveAt: newTimeStamp()
      };
    default:
      return state;
  }
}

export default authReducer;
