import {
  FETCH_SYSTEM_INTAKES,
  STORE_SYSTEM_INTAKES
} from 'constants/systemIntakes';
import { SystemIntakeForm } from 'types/systemIntake';

type FetchSystemIntakesAction = {
  type: string;
  accessToken: string;
};

export function fetchSystemIntakes(
  accessToken: string
): FetchSystemIntakesAction {
  return {
    type: FETCH_SYSTEM_INTAKES,
    accessToken
  };
}

type StoreSystemIntakesAction = {
  type: string;
  systemIntakes: SystemIntakeForm[];
};

export function storeSystemIntakes(
  systemIntakes: SystemIntakeForm[]
): StoreSystemIntakesAction {
  return {
    type: STORE_SYSTEM_INTAKES,
    systemIntakes
  };
}
