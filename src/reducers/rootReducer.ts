import { combineReducers } from 'redux';

import actionReducer from 'reducers/actionReducer';
import systemIntakesReducer from 'reducers/systemIntakesReducer';

import authReducer from './authReducer';
import businessCaseReducer from './businessCaseReducer';
import fileReducer from './fileReducer';
import systemIntakeReducer from './systemIntakeReducer';

const rootReducer = combineReducers({
  systemIntake: systemIntakeReducer,
  systemIntakes: systemIntakesReducer,
  businessCase: businessCaseReducer,
  action: actionReducer,
  auth: authReducer,
  files: fileReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
