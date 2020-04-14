import { combineReducers } from 'redux';
import systemIntakesReducer from 'reducers/systemIntakesReducer';
import systemsReducer from './systemsReducer';

const rootReducer = combineReducers({
  search: systemsReducer,
  systemIntakes: systemIntakesReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
