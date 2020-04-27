import { createRoutine } from 'redux-saga-routines';

export const fetchSystemIntakes = createRoutine('FETCH_SYSTEM_INTAKES');
export const fetchSystemIntake = createRoutine('FETCH_SYSTEM_INTAKE');
export const saveSystemIntake = createRoutine('PUT_SYSTEM_INTAKE');
