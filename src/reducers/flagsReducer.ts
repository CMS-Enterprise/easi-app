import { DateTime } from 'luxon';
import { Action } from 'redux-actions';

import { ClientFlagsState } from '../types/flags';
import { fetchClientFlags } from '../types/routines';

const initialState: ClientFlagsState = {
  taskListLite: false,
  isLoading: null,
  loadedTimestamp: null,
  error: null
};
function clientFlagsReducer(
  state = initialState,
  action: Action<any>
): ClientFlagsState {
  switch (action.type) {
    case fetchClientFlags.REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case fetchClientFlags.SUCCESS:
      return {
        ...state,
        taskListLite: action.payload.flags.taskListLite,
        loadedTimestamp: DateTime.local()
      };
    case fetchClientFlags.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case fetchClientFlags.FULFILL:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

export default clientFlagsReducer;
