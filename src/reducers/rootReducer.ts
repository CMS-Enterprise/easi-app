import { combineReducers } from 'redux';

import actionReducer from 'reducers/actionReducer';

import authReducer from './authReducer';
import businessCaseReducer from './businessCaseReducer';
import systemIntakeReducer from './systemIntakeReducer';

const rootReducer = combineReducers({
  systemIntake: systemIntakeReducer,
  businessCase: businessCaseReducer,
  action: actionReducer,
  auth: authReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
