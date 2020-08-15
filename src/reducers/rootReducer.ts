import { combineReducers } from 'redux';

import systemIntakesReducer from 'reducers/systemIntakesReducer';

import authReducer from './authReducer';
import businessCaseReducer from './businessCaseReducer';
import businessCasesReducer from './businessCasesReducer';
import systemIntakeReducer from './systemIntakeReducer';
import systemsReducer from './systemsReducer';

const rootReducer = combineReducers({
  search: systemsReducer,
  systemIntake: systemIntakeReducer,
  systemIntakes: systemIntakesReducer,
  businessCase: businessCaseReducer,
  businessCases: businessCasesReducer,
  auth: authReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
