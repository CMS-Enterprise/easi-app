import { GET_ALL_SYSTEM_SHORTS, PUT_SYSTEM_SHORTS } from '../constants/search';

// TODO: rename this. Should this have these types?
interface SendMessageAction {
  type: string;
  payload?: any;
}

export function getAllSystemShorts(accessToken: string): SendMessageAction {
  return {
    type: GET_ALL_SYSTEM_SHORTS,
    payload: accessToken
  };
}

export function putSystemShorts(shorts: any): SendMessageAction {
  return {
    type: PUT_SYSTEM_SHORTS,
    payload: shorts
  };
}
