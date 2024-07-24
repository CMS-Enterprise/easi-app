import { initialSystemIntakeForm } from 'data/systemIntake';
import systemIntakeReducer from 'reducers/systemIntakeReducer';

describe('The system intake reducer', () => {
  it('returns the initial state', () => {
    // @ts-ignore
    expect(systemIntakeReducer(undefined, {})).toEqual({
      systemIntake: initialSystemIntakeForm,
      isLoading: null,
      isSaving: false,
      isNewIntakeCreated: null,
      error: null,
      notes: []
    });
  });
});
