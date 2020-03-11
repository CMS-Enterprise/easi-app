import { SAVE_SYSTEM_INTAKE } from 'constants/systemIntake';
import { SystemIntakeForm, SaveSystemIntakeAction } from 'types/systemIntake';

// eslint-disable-next-line import/prefer-default-export
export function saveSystemIntake(
  formData: SystemIntakeForm
): SaveSystemIntakeAction {
  return {
    type: SAVE_SYSTEM_INTAKE,
    formData
  };
}
