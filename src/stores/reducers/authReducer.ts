import { Action } from 'redux-actions';

type authReducerState = {
  name: string;
  euaId: string;
  groups: Array<string>;
  isUserSet: boolean;
};

const SET_USER = 'AUTH_REDUCER_SET_USER';
export const setUser = (user: any) => ({
  type: SET_USER,
  payload: user
});

const initialState: authReducerState = {
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
