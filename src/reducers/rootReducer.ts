import { combineReducers } from 'redux';
import systemIntakesReducer from 'reducers/systemIntakesReducer';
import systemsReducer from './systemsReducer';
import systemIntakeReducer from './systemIntakeReducer';
import businessCaseReducer from './businessCaseReducer';
import businessCasesReducer from './businessCasesReducer';
import authReducer from './authReducer';

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
