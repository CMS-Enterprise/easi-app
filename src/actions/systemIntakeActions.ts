import { PUT_SYSTEM_INTAKE } from 'constants/actions';
import { SystemIntakeForm, PutSystemIntakeAction } from 'types/systemIntake';

// eslint-disable-next-line import/prefer-default-export
export function saveSystemIntake(
  id: string,
  formData: SystemIntakeForm
): PutSystemIntakeAction {
  return {
    type: PUT_SYSTEM_INTAKE,
    id,
    formData
  };
}

type GetSystemIntakeAction = {
  type: string;
  intakeID: string;
};
