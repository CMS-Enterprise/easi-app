import { combineReducers } from 'redux';
import systemIntakesReducer from 'reducers/systemIntakesReducer';
import systemsReducer from './systemsReducer';
import systemIntakeReducer from './systemIntakeReducer';
import businessCaseReducer from './businessCaseReducer';

const rootReducer = combineReducers({
  search: systemsReducer,
  systemIntake: systemIntakeReducer,
  systemIntakes: systemIntakesReducer,
  businessCase: businessCaseReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
