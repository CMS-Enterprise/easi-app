import {
  FETCH_SYSTEM_INTAKES,
  STORE_SYSTEM_INTAKES
} from 'constants/systemIntakes';
import {
  FetchSystemIntakesAction,
  StoreSystemIntakesAction,
  SystemIntakeForm
} from 'types/systemIntake';

export function fetchSystemIntakes(): FetchSystemIntakesAction {
  return {
    type: FETCH_SYSTEM_INTAKES
  };
}

export function storeSystemIntakes(
  systemIntakes: SystemIntakeForm[]
): StoreSystemIntakesAction {
  return {
    type: STORE_SYSTEM_INTAKES,
    systemIntakes
  };
}
