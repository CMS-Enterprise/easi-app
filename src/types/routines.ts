import { createRoutine } from 'redux-saga-routines';

import { CreateActionPayload } from 'types/action';

// SystemIntakes routines
export const fetchSystemIntakes = createRoutine('FETCH_SYSTEM_INTAKES');

// SystemIntake routines
export const fetchSystemIntake = createRoutine('FETCH_SYSTEM_INTAKE');
export const postSystemIntake = createRoutine('POST_SYSTEM_INTAKE');
export const saveSystemIntake = createRoutine('PUT_SYSTEM_INTAKE');
export const storeSystemIntake = createRoutine('STORE_SYSTEM_INTAKE');
export const clearSystemIntake = createRoutine('CLEAR_SYSTEM_INTAKE');
export const archiveSystemIntake = createRoutine('ARCHIVE_SYSTEM_INTAKE');
export const issueLifecycleIdForSystemIntake = createRoutine(
  'ISSUE_LIFECYCLE_ID_FOR_SYSTEM_INTAKE'
);
export const fetchIntakeNotes = createRoutine('FETCH_INTAKE_NOTES');
export const postIntakeNote = createRoutine('POST_INTAKE_NOTE');
export const rejectSystemIntake = createRoutine('REJECT_SYSTEM_INTAKE');

// SystemShorts routines
export const fetchSystemShorts = createRoutine('FETCH_SYSTEM_SHORTS');

// BusinessCase routines
export const fetchBusinessCases = createRoutine('FETCH_BUSINESS_CASES');
export const fetchBusinessCase = createRoutine('FETCH_BUSINESS_CASE');
export const postBusinessCase = createRoutine('POST_BUSINESS_CASE');
export const putBusinessCase = createRoutine('PUT_BUSINESS_CASE');
export const storeBusinessCase = createRoutine('STORE_BUSINESS_CASE');
export const clearBusinessCase = createRoutine('CLEAR_BUSINESS_CASE');

// Action routines
export const postAction = createRoutine<CreateActionPayload>('POST_ACTION');

// File routines
export const postFileUploadURL = createRoutine('POST_FILE_UPLOAD_URL');
export const putFileS3 = createRoutine('PUT_FILE_S3');
export const getFileS3 = createRoutine('GET_FILE_S3');
