import { createRoutine } from 'redux-saga-routines';

// SystemIntakes routines
export const fetchSystemIntakes = createRoutine('FETCH_SYSTEM_INTAKES');

// SystemIntake routines
export const fetchSystemIntake = createRoutine('FETCH_SYSTEM_INTAKE');
export const postSystemIntake = createRoutine('POST_SYSTEM_INTAKE');
export const saveSystemIntake = createRoutine('PUT_SYSTEM_INTAKE');
export const storeSystemIntake = createRoutine('STORE_SYSTEM_INTAKE');
export const submitSystemIntake = createRoutine('SUBMIT_SYSTEM_INTAKE');
export const clearSystemIntake = createRoutine('CLEAR_SYSTEM_INTAKE');
export const reviewSystemIntake = createRoutine('REVIEW_SYSTEM_INTAKE');
export const archiveSystemIntake = createRoutine('ARCHIVE_SYSTEM_INTAKE');

// SystemShorts routines
export const fetchSystemShorts = createRoutine('FETCH_SYSTEM_SHORTS');

// BusinessCase routines
export const fetchBusinessCases = createRoutine('FETCH_BUSINESS_CASES');
export const fetchBusinessCase = createRoutine('FETCH_BUSINESS_CASE');
export const postBusinessCase = createRoutine('POST_BUSINESS_CASE');
export const putBusinessCase = createRoutine('PUT_BUSINESS_CASE');
export const storeBusinessCase = createRoutine('STORE_BUSINESS_CASE');
export const submitBusinessCase = createRoutine('SUBMIT_BUSINESS_CASE');
export const clearBusinessCase = createRoutine('CLEAR_BUSINESS_CASE');

// Flags routines
export const fetchClientFlags = createRoutine('FETCH_CLIENT_FLAGS');
