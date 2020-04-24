import { combineReducers } from 'redux';
import systemIntakesReducer from 'reducers/systemIntakesReducer';
import systemsReducer from './systemsReducer';
import systemIntakeReducer from './systemIntakeReducer';

const rootReducer = combineReducers({
  search: systemsReducer,
  systemIntake: systemIntakeReducer,
  systemIntakes: systemIntakesReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;

export enum LoadingStatus {
  Unstarted,
  InProgress,
  Success,
  Failure
}
