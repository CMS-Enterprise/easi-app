import { Action } from 'redux-actions';

import { initialSystemIntakeForm } from 'data/systemIntake';
import { archiveSystemIntake } from 'types/routines';
import { SystemIntakeState } from 'types/systemIntake';

const initialState: SystemIntakeState = {
  systemIntake: initialSystemIntakeForm,
  isLoading: null,
  isSaving: false,
  isNewIntakeCreated: null,
  error: null,
  notes: []
};

function systemIntakeReducer(
  state = initialState,
  action: Action<any>
): SystemIntakeState {
  switch (action.type) {
    case archiveSystemIntake.SUCCESS:
      return initialState;
    default:
      return state;
  }
}

export default systemIntakeReducer;
