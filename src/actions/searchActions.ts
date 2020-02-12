import { GET_ALL_SYSTEM_SHORTS } from '../constants/search';

interface SendMessageAction {}

// eslint-disable-next-line import/prefer-default-export
export function getAllSystemShorts(accessToken: string): SendMessageAction {
  return {
    type: GET_ALL_SYSTEM_SHORTS,
    payload: accessToken
  };
}
