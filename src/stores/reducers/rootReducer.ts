import { combineReducers } from 'redux';
import actionReducer from 'stores/reducers/actionReducer';

import authReducer from './authReducer';
import businessCaseReducer from './businessCaseReducer';

const rootReducer = combineReducers({
  businessCase: businessCaseReducer,
  action: actionReducer,
  auth: authReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
