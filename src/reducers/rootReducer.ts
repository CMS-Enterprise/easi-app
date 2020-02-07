import { combineReducers } from 'redux';
import demoName from './demoName';
import searchReducer from './searchReducer';

export default combineReducers({
  demoName,
  searchReducer
});
