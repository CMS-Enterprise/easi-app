import { combineReducers } from 'redux';
import systemIntakesReducer from 'reducers/systemIntakesReducer';
import systemsReducer from './systemsReducer';
import systemIntakeReducer from './systemIntakeReducer';
import businessCaseReducer from './businessCaseReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  search: systemsReducer,
  systemIntake: systemIntakeReducer,
  systemIntakes: systemIntakesReducer,
  businessCase: businessCaseReducer,
  auth: authReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
