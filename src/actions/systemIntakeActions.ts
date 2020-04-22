import {
  PUT_SYSTEM_INTAKE,
  GET_SYSTEM_INTAKE,
  STORE_SYSTEM_INTAKE
} from 'constants/actions';
import { SystemIntakeForm, PutSystemIntakeAction } from 'types/systemIntake';

export function saveSystemIntake(
  formData: SystemIntakeForm
): PutSystemIntakeAction {
  return {
    type: PUT_SYSTEM_INTAKE,
    formData
  };
}

type GetSystemIntakeAction = {
  type: string;
  intakeID: string;
};

export function getSystemIntake(intakeID: string): GetSystemIntakeAction {
  return {
    type: GET_SYSTEM_INTAKE,
    intakeID
  };
}

type StoreSystemIntakeAction = {
  type: string;
  systemIntake: SystemIntakeForm;
};

export function storeSystemIntake(
  systemIntake: SystemIntakeForm
): StoreSystemIntakeAction {
  return {
    type: STORE_SYSTEM_INTAKE,
    systemIntake
  };
}
