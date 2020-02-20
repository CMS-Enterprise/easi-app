import {
  GET_ALL_SYSTEM_SHORTS,
  UPDATE_SYSTEM_SHORTS
} from '../constants/system';
import { ShortSystem } from '../types/system';

type GetAllSystemShortsAction = {
  type: string;
  accessToken: string;
};

export function getAllSystemShorts(
  accessToken: string
): GetAllSystemShortsAction {
  return {
    type: GET_ALL_SYSTEM_SHORTS,
    accessToken
  };
}

type PutSystemShortsAction = {
  type: string;
  shorts: ShortSystem[];
};

export function putSystemShorts(shorts: ShortSystem[]): PutSystemShortsAction {
  return {
    type: UPDATE_SYSTEM_SHORTS,
    shorts
  };
}
