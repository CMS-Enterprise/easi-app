import { combineReducers } from 'redux';
import systemIntakesReducer from 'reducers/systemIntakesReducer';
import systemsReducer from './systemsReducer';
import systemIntakeReducer from './systemIntakeReducer';
import businessCasesReducer from './businessCasesReducer';

const rootReducer = combineReducers({
  search: systemsReducer,
  systemIntake: systemIntakeReducer,
  systemIntakes: systemIntakesReducer,
  businessCases: businessCasesReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
