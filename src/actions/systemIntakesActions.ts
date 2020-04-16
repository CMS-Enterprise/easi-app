import { GET_SYSTEM_INTAKES, STORE_SYSTEM_INTAKES } from 'constants/actions';
import {
  GetSystemIntakesAction,
  StoreSystemIntakesAction,
  SystemIntakeForm
} from 'types/systemIntake';

export function getSystemIntakes(): GetSystemIntakesAction {
  return {
    type: GET_SYSTEM_INTAKES
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
