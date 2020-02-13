import { GET_ALL_SYSTEM_SHORTS, PUT_SYSTEM_SHORTS } from '../constants/search';

// TODO: this is the struct of our state, right? Should have a different name and be filled out with the shape of our state.
interface SearchInterface {}

const initialState: SearchInterface = {};

function searchReducer(state = initialState, action: any): SearchInterface {
  switch (action.type) {
    case GET_ALL_SYSTEM_SHORTS:
      return state;
    case PUT_SYSTEM_SHORTS:
      return {
        ...state,
        systemSearch: action.payload.data
      };
    case '':
      return state;
    default:
      return state;
  }
}

export default searchReducer;
