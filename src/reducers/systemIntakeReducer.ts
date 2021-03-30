import { DateTime } from 'luxon';
import { Action } from 'redux-actions';

import {
  initialSystemIntakeForm,
  prepareSystemIntakeForApp
} from 'data/systemIntake';
import {
  archiveSystemIntake,
  clearSystemIntake,
  fetchIntakeNotes,
  fetchSystemIntake,
  issueLifecycleIdForSystemIntake,
  postIntakeNote,
  postSystemIntake,
  saveSystemIntake,
  storeSystemIntake
} from 'types/routines';
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
    case fetchSystemIntake.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case fetchSystemIntake.SUCCESS:
      return {
        ...state,
        systemIntake: prepareSystemIntakeForApp(action.payload)
      };
    case fetchSystemIntake.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case fetchSystemIntake.FULFILL:
      return {
        ...state,
        isLoading: false
      };
    case clearSystemIntake.TRIGGER:
      return initialState;
    case postSystemIntake.REQUEST:
      return {
        ...state,
        isSaving: true
      };
    case postSystemIntake.SUCCESS:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          ...action.payload
        },
        isNewIntakeCreated: true
      };
    case postSystemIntake.FAILURE:
      return {
        ...state,
        error: action.payload,
        isNewIntakeCreated: false
      };
    case postSystemIntake.FULFILL:
      return {
        ...state,
        isSaving: false,
        isNewIntakeCreated: null
      };
    case saveSystemIntake.REQUEST:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          ...action.payload
        },
        isSaving: true
      };
    case saveSystemIntake.SUCCESS:
      return state;
    case saveSystemIntake.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case saveSystemIntake.FULFILL:
      return {
        ...state,
        isSaving: false
      };
    case storeSystemIntake.TRIGGER:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          ...action.payload
        },
        isLoading: false,
        error: null
      };
    case storeSystemIntake.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case storeSystemIntake.FULFILL:
      return {
        ...state,
        isLoading: false
      };
    case archiveSystemIntake.SUCCESS:
      return initialState;
    case issueLifecycleIdForSystemIntake.SUCCESS:
      return {
        ...state,
        systemIntake: {
          ...state.systemIntake,
          ...prepareSystemIntakeForApp(action.payload)
        }
      };
    case postIntakeNote.SUCCESS:
      return {
        ...state,
        notes: [
          {
            ...action.payload,
            createdAt: DateTime.fromISO(action.payload.createdAt)
          },
          ...state.notes
        ]
      };
    case fetchIntakeNotes.TRIGGER:
      return {
        ...state,
        notes: []
      };
    case fetchIntakeNotes.SUCCESS:
      return {
        ...state,
        notes: action.payload.map((note: any) => ({
          ...note,
          createdAt: DateTime.fromISO(note.createdAt)
        }))
      };
    case fetchIntakeNotes.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}

export default systemIntakeReducer;
