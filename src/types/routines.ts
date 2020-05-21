import { createRoutine } from 'redux-saga-routines';

// SystemIntakes routines
export const fetchSystemIntakes = createRoutine('FETCH_SYSTEM_INTAKES');

// SystemIntake routines
export const fetchSystemIntake = createRoutine('FETCH_SYSTEM_INTAKE');
export const saveSystemIntake = createRoutine('PUT_SYSTEM_INTAKE');
export const storeSystemIntake = createRoutine('STORE_SYSTEM_INTAKE');

// SystemShorts routines
export const fetchSystemShorts = createRoutine('FETCH_SYSTEM_SHORTS');

// BusinessCase routines
export const fetchBusinessCase = createRoutine('FETCH_BUSINESS_CASE');
export const postBusinessCase = createRoutine('POST_BUSINESS_CASE');
export const putBusinessCase = createRoutine('PUT_BUSINESS_CASE');
export const storeBusinessCase = createRoutine('STORE_BUSINESS_CASE');
