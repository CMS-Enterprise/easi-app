import { combineReducers } from 'redux';
import demoName from './demoName';
import systemsReducer from './systemsReducer';

const rootReducer = combineReducers({
  demoName,
  search: systemsReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
