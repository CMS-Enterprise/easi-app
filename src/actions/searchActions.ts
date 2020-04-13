import {
  GET_ALL_SYSTEM_SHORTS,
  UPDATE_SYSTEM_SHORTS
} from '../constants/system';
import { ShortSystem } from '../types/system';

type GetAllSystemShortsAction = {
  type: string;
};

export function getAllSystemShorts(): GetAllSystemShortsAction {
  return {
    type: GET_ALL_SYSTEM_SHORTS
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
