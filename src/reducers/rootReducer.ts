import { combineReducers } from 'redux';
import systemsReducer from './systemsReducer';

const rootReducer = combineReducers({
  search: systemsReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
