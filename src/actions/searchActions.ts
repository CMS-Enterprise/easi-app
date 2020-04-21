import {
  GET_ALL_SYSTEM_SHORTS,
  STORE_SYSTEM_SHORTS
} from '../constants/actions';
import { ShortSystem } from '../types/system';

type GetAllSystemShortsAction = {
  type: string;
};

export function getAllSystemShorts(): GetAllSystemShortsAction {
  return {
    type: GET_ALL_SYSTEM_SHORTS
  };
}

type StoreSystemShortsAction = {
  type: string;
  shorts: ShortSystem[];
};

export function storeSystemShorts(
  shorts: ShortSystem[]
): StoreSystemShortsAction {
  return {
    type: STORE_SYSTEM_SHORTS,
    shorts
  };
}
