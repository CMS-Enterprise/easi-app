import { GET_ALL_SYSTEM_SHORTS } from '../constants/search';

interface SearchInterface {}

const initialState: SearchInterface = {};

function searchReducer(state = initialState, action: any): SearchInterface {
  switch (action.type) {
    case GET_ALL_SYSTEM_SHORTS:
      console.log('in the reducer');
      return state;
    case '':
      return state;
    default:
      return state;
  }
}

export default searchReducer;
