import { createRoutine } from 'redux-saga-routines';

// SystemIntakes routines
export const fetchSystemIntakes = createRoutine('FETCH_SYSTEM_INTAKES');

// SystemIntake routines
export const fetchSystemIntake = createRoutine('FETCH_SYSTEM_INTAKE');
export const saveSystemIntake = createRoutine('PUT_SYSTEM_INTAKE');
export const storeSystemIntakeId = createRoutine('STORE_SYSTEM_INTAKE_ID');

// SystemShorts routines
export const fetchSystemShorts = createRoutine('FETCH_SYSTEM_SHORTS');
