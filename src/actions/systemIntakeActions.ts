import {
  PUT_SYSTEM_INTAKE,
  GET_SYSTEM_INTAKE,
  UPDATE_SYSTEM_INTAKE
} from 'constants/systemIntake';
import {
  SystemIntakeForm,
  SaveSystemIntakeAction,
  SystemIntakeID
} from 'types/systemIntake';

export function saveSystemIntake(
  id: string,
  formData: SystemIntakeForm
): SaveSystemIntakeAction {
  return {
    type: PUT_SYSTEM_INTAKE,
    id,
    formData
  };
}

type GetSystemIntakeAction = {
  type: string;
  accessToken: string;
  intakeID: SystemIntakeID;
};

export function getSystemIntake(
  accessToken: string,
  intakeID: SystemIntakeID
): GetSystemIntakeAction {
  return {
    type: GET_SYSTEM_INTAKE,
    accessToken,
    intakeID
  };
}

type PutSystemIntakeAction = {
  type: string;
  systemIntake: SystemIntakeForm;
};

export function putSystemIntake(
  systemIntake: SystemIntakeForm
): PutSystemIntakeAction {
  return {
    type: UPDATE_SYSTEM_INTAKE,
    systemIntake
  };
}
