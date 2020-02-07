import { GET_ALL_SYSTEM_SHORTS } from '../constants/search';

interface SendMessageAction {}

// eslint-disable-next-line import/prefer-default-export
export function getAllSystemShorts(): SendMessageAction {
  // eslint-disable-next-line no-console
  console.log('searchActions.ts');
  return {
    type: GET_ALL_SYSTEM_SHORTS
  };
}
